import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/config/constants';
import { useAuth } from '@/context/AuthProvider';
import {toast} from "react-toastify"
interface FormValues {
  title: string;
  content: string;
}

const CreateNoteForm: React.FC = () => {
    const {token} = useAuth();
    const navigate = useNavigate();
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      content: '',
    },
  });
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
        const res = await fetch(`${API_URL}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        if(!res.ok) {
            const resData = await res.json();
            console.log(resData?.detail);
            throw new Error(resData?.detail);
        }
        return res.json();
    },
    onSuccess: (data) => {
        toast.success("Pomyślnie wygenerowano notatkę")
        navigate("/planning")
    },
    onError: (error: Error) => {
        console.log(error);
    }
  })
  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Link to={'/'} className='text-muted-foreground text-left w-full pl-10 p-2'>Powrót</Link>
        <div className="w-[85%] bg-gradient-to-r from-purple-400 to-pink-500 text-white p-4 rounded-lg mb-4">
          <h2 className="text-2xl font-bold text pl-2">Tworzenie notatek</h2>
          <p className="text pl-3">Przyspiesz swoją naukę</p>
        </div>
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tytuł notatki" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treść notatki</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Treść notatki" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Utwórz notatkę
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateNoteForm;