import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import { Routes, Route, Navigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import NewNote from '../NewNote/NewNote.tsx'
import NoteList from '../NoteList/NoteList.tsx'
import NoteLayout from '../NoteLayout/NoteLayout.tsx'
import useLocalStorage from '../../hooks/useLocalStorage.tsx'
import { useEffect, useMemo } from 'react'
import { Note } from '../Note/Note.tsx'
import EditNote from '../EditNote/EditNote.tsx'

export type Note = {
  id: string
} & NoteData

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
};

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
};


export type Tag = {
  id: string
  label: string
}


function App() {

  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [...prevNotes, {
        ...data,
        id: uuidv4(),
        tagIds: tags.map(tag => tag.id)
      }]
    })
  }

  function onDeleteNote(id: string,) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return {
            ...note, ...data,
            tagIds: tags.map(tag => tag.id)
          }
        } else { return note }
      })
    })
  }

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }
  function updateTag(id: string, label: string) {
    setTags(
      prevTags => {
        return prevTags.map(tag => {
          if (tag.id === id) {
            return { ...tag, label }
          }
          else {
            return tag
          }
        })
      }
    )
  }

  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }

  useEffect(() => {
    console.log(uuidv4());
  }, [])

  return (
    <Container className='my-4'>
      <Routes>
        <Route path='/' element={
          <NoteList
            notes={notesWithTags}
            availableTags={tags}
            onUpdateTag={updateTag}
            onDeleteTag={deleteTag}
          />} />
        <Route path='/new'
          element={<NewNote
            onSubmit={onCreateNote}
            onAddTag={addTag}
            availableTags={tags}
          />} />
        <Route path='/:id'
          element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note
            onDelete={onDeleteNote}
          />} />
          <Route path='edit' element={<EditNote
            onSubmit={onUpdateNote}
            onAddTag={addTag}
            availableTags={tags}
          />} />
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Container >
  )
}

export default App
