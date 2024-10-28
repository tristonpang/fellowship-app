import React, { useState } from 'react';
import { FileText, Plus, Check, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Note {
  id: string;
  content: string;
  type: 'general' | 'prayer';
  isAnswered: boolean;
  createdAt: string;
}

interface NotesSectionProps {
  menteeId: string;
  notes: Note[];
}

export function NotesSection({ menteeId, notes }: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'general' | 'prayer'>('general');
  const queryClient = useQueryClient();

  const { mutate: addNote } = useMutation({
    mutationFn: async () => {
      return axios.post(`/api/mentees/${menteeId}/notes`, {
        content: newNote,
        type: noteType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentee', menteeId] });
      setNewNote('');
    },
  });

  const { mutate: toggleAnswered } = useMutation({
    mutationFn: async (noteId: string) => {
      return axios.patch(`/api/notes/${noteId}/toggle-answered`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentee', menteeId] });
    },
  });

  const { mutate: deleteNote } = useMutation({
    mutationFn: async (noteId: string) => {
      return axios.delete(`/api/notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentee', menteeId] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note or prayer request..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows={3}
        />
        <div className="space-y-2">
          <select
            value={noteType}
            onChange={(e) => setNoteType(e.target.value as 'general' | 'prayer')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="general">General Note</option>
            <option value="prayer">Prayer Request</option>
          </select>
          <button
            onClick={() => addNote()}
            disabled={!newNote.trim()}
            className="w-full inline-flex justify-center items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`relative bg-white p-4 rounded-lg border ${
              note.type === 'prayer' ? 'border-blue-200' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <FileText className={`h-5 w-5 ${note.type === 'prayer' ? 'text-blue-500' : 'text-gray-500'}`} />
                <span className="text-sm font-medium capitalize">{note.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                {note.type === 'prayer' && (
                  <button
                    onClick={() => toggleAnswered(note.id)}
                    className={`rounded-full p-1 ${
                      note.isAnswered ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNote(note.id)}
                  className="rounded-full p-1 bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-gray-600">{note.content}</p>
            <div className="mt-2 text-xs text-gray-400">
              {new Date(note.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}