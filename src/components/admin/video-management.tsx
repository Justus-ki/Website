
'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Video } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AddVideoForm } from './add-video-form';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export function VideoManagement() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState<Video | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'videos'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const videosData: Video[] = [];
        querySnapshot.forEach((doc) => {
          videosData.push({ id: doc.id, ...doc.data() } as Video);
        });
        setVideos(videosData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching videos: ', error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAddNew = () => {
    setVideoToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (video: Video) => {
    setVideoToEdit(video);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = (video: Video) => {
    setVideoToDelete(video);
  };

  const handleDelete = async () => {
    if (!videoToDelete) return;
    try {
      await deleteDoc(doc(db, 'videos', videoToDelete.id));
      toast({
        title: 'Success',
        description: 'Video has been successfully deleted.',
      });
      setVideoToDelete(null);
    } catch (error) {
      console.error('Error deleting video: ', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete video. Please try again.',
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Videos</CardTitle>
            <CardDescription>Add, edit, or delete videos from the carousel.</CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Video
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="border rounded-md">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[120px]">Thumbnail</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {videos.length > 0 ? (
                    videos.map((video) => (
                        <TableRow key={video.id}>
                        <TableCell>
                            <Image
                            src={video.thumbnailUrl}
                            alt={video.title}
                            width={120}
                            height={68}
                            className="rounded-md object-cover"
                            />
                        </TableCell>
                        <TableCell className="font-medium">{video.title}</TableCell>
                        <TableCell>{video.creator}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(video)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteConfirm(video)}
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                        No videos found.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{videoToEdit ? 'Edit Video' : 'Add New Video'}</DialogTitle>
            <DialogDescription>
              {videoToEdit ? 'Update the details for this video.' : 'Fill in the details for the new video.'}
            </DialogDescription>
          </DialogHeader>
          <AddVideoForm
            videoToEdit={videoToEdit}
            onFinished={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!videoToDelete} onOpenChange={() => setVideoToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the video
                from your website.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
