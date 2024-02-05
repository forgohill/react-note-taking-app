import { Navigate, Outlet, useOutletContext, useParams } from 'react-router-dom';
import { Note } from "../App/App"

type NoteLeyoutProps = {
  notes: Note[]
}

export default function NoteLayout({ notes }: NoteLeyoutProps) {
  const { id } = useParams();
  const note = notes.find(n => n.id === id);

  if (note == null) return <Navigate to="/" replace />

  return <Outlet context={note} />
}

export function useNote() {
  return useOutletContext<Note>();
}
