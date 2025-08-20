
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit, where, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const MESSAGE_LENGTH_LIMIT = 280;
const SEND_COOLDOWN_SECONDS = 5;

export function LiveChat() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayTimestamp = Timestamp.fromDate(yesterday);

        const q = query(
            collection(db, 'messages'), 
            where('timestamp', '>', yesterdayTimestamp),
            orderBy('timestamp', 'asc'), 
            limit(100)
        );
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs: Message[] = [];
            querySnapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() } as Message);
            });
            setMessages(msgs);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching messages: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newMessage.trim().length > MESSAGE_LENGTH_LIMIT) {
             toast({
                variant: 'destructive',
                title: 'Message too long',
                description: `Your message must be ${MESSAGE_LENGTH_LIMIT} characters or less.`,
            });
            return;
        }

        if (newMessage.trim() === '' || !user || isSending || cooldown > 0) {
             if (cooldown > 0) {
                toast({
                    variant: 'destructive',
                    title: 'Slow down!',
                    description: `You can send another message in ${cooldown} seconds.`,
                });
            }
            return
        };
        
        setIsSending(true);
        try {
            await addDoc(collection(db, 'messages'), {
                text: newMessage,
                username: user.displayName || 'Anonymous',
                timestamp: serverTimestamp(),
                uid: user.uid,
            });
            setNewMessage('');
            setCooldown(SEND_COOLDOWN_SECONDS);
        } catch (error) {
            console.error("Error sending message: ", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to send message. Please try again.',
            });
        } finally {
            setIsSending(false);
        }
    };
    
    const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return '...';
        return new Date(timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <section id="live-chat">
            <Card className="bg-card/50">
                <CardHeader className="text-center">
                     <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 p-3">
                        <MessageCircle className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight md:text-4xl">Live Chat</CardTitle>
                    <CardDescription className="mt-3 text-lg">
                        Join the conversation with the community! (Messages from last 24h)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Card className="flex h-[400px] flex-col bg-background">
                       <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                            {isLoading ? (
                                <div className="flex h-full items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : messages.length > 0 ? (
                                <div className="space-y-4">
                                {messages.map((msg) => {
                                    const isMyMessage = user && user.uid === msg.uid;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                'flex items-end gap-2 text-sm',
                                                isMyMessage ? 'justify-end' : 'justify-start'
                                            )}
                                        >
                                            {!isMyMessage && (
                                                <div className="flex-shrink-0 text-right">
                                                    <div className="font-bold text-primary">{msg.username}</div>
                                                    <div className="text-xs text-muted-foreground">{formatTimestamp(msg.timestamp)}</div>
                                                </div>
                                            )}
                                            <div
                                                className={cn(
                                                    'max-w-xs md:max-w-md rounded-lg px-3 py-2',
                                                    isMyMessage
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                )}
                                            >
                                                <p className="break-words">{msg.text}</p>
                                            </div>
                                            {isMyMessage && (
                                                <div className="flex-shrink-0 text-left">
                                                     <div className="font-bold">You</div>
                                                     <div className="text-xs text-muted-foreground">{formatTimestamp(msg.timestamp)}</div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                                </div>
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    <p>No messages yet. Be the first to say something!</p>
                                </div>
                            )}
                       </ScrollArea>
                        <div className="border-t p-4">
                            {user ? (
                                 <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        disabled={isSending || cooldown > 0}
                                        maxLength={MESSAGE_LENGTH_LIMIT}
                                    />
                                    <Button type="submit" disabled={isSending || newMessage.trim() === '' || cooldown > 0}>
                                        {isSending ? <Loader2 className="animate-spin" /> : (cooldown > 0 ? cooldown : <Send />)}
                                    </Button>
                                </form>
                            ) : (
                                <Button asChild className="w-full">
                                    <Link href="/login">Log in to chat</Link>
                                </Button>
                            )}
                        </div>
                    </Card>
                </CardContent>
            </Card>
        </section>
    );
}
