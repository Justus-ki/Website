
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Video } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  creator: z
    .string()
    .min(3, { message: 'Creator name must be at least 3 characters.' }),
  videoUrl: z.string().url({ message: 'Please enter a valid YouTube URL.' }),
});

// Helper function to extract YouTube video ID and create thumbnail URL
const getYouTubeThumbnail = (url: string): string | null => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  } else {
    return null;
  }
};

interface AddVideoFormProps {
  videoToEdit?: Video | null;
  onFinished: () => void;
}

export function AddVideoForm({ videoToEdit, onFinished }: AddVideoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEditMode = !!videoToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      creator: '',
      videoUrl: '',
    },
  });

  useEffect(() => {
    if (videoToEdit) {
      form.reset({
        title: videoToEdit.title,
        creator: videoToEdit.creator,
        videoUrl: videoToEdit.videoUrl,
      });
    } else {
      form.reset({ title: '', creator: '', videoUrl: '' });
    }
  }, [videoToEdit, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const thumbnailUrl = getYouTubeThumbnail(values.videoUrl);

    if (!thumbnailUrl) {
      toast({
        variant: 'destructive',
        title: 'Invalid URL',
        description: 'Please provide a valid YouTube video URL.',
      });
      setIsLoading(false);
      return;
    }

    try {
        if(isEditMode && videoToEdit) {
            const videoRef = doc(db, 'videos', videoToEdit.id);
            await updateDoc(videoRef, {
                title: values.title,
                creator: values.creator,
                videoUrl: values.videoUrl,
                thumbnailUrl: thumbnailUrl,
            });
             toast({
                title: 'Success',
                description: 'Video has been successfully updated.',
            });
        } else {
             await addDoc(collection(db, 'videos'), {
                title: values.title,
                creator: values.creator,
                videoUrl: values.videoUrl,
                thumbnailUrl: thumbnailUrl,
                timestamp: serverTimestamp(),
            });
             toast({
                title: 'Success',
                description: 'Video has been successfully added.',
            });
        }
      onFinished();
      form.reset();
    } catch (error) {
      console.error('Error saving video: ', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} video. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Title</FormLabel>
              <FormControl>
                <Input placeholder="NEW META! Hog Rider Deck..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="creator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Creator Name</FormLabel>
              <FormControl>
                <Input placeholder="ClashPro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? 'Update Video' : 'Add Video'}
        </Button>
      </form>
    </Form>
  );
}
