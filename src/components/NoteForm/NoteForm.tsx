import { FormEvent, useRef, useState } from 'react';
import { Button, Col, Form, Row, Stack } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import CreatableReactSelect from 'react-select/creatable'
import { NoteData, Tag } from '../App/App'

type NoteFormProps = {
  onSubmit: (date: NoteData) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
} & Partial<NoteData>

export default function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    })
    setSelectedTags([]);
    navigate('..')
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack
        gap={4}>
        <Row>
          <Col>
            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required
                defaultValue={title} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId='tags'>
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect isMulti
                onCreateOption={label => {
                  const newTag = { id: uuidv4(), label }
                  onAddTag(newTag)
                  setSelectedTags(prev => [...prev, newTag])
                }}
                value={selectedTags.map(tag => {
                  return { label: tag.label, value: tag.id }
                })}
                options={availableTags.map(tag => {
                  return { label: tag.label, value: tag.id }
                })}
                onChange={tags => {
                  setSelectedTags(tags.map(
                    tag => {
                      return { label: tag.label, id: tag.value }
                    }))
                }}
              ></CreatableReactSelect>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId='markdown'>
          <Form.Label>Body</Form.Label>
          <Form.Control
            defaultValue={markdown}
            ref={markdownRef}
            required as={'textarea'} rows={5} />
        </Form.Group>
        <Stack
          gap={2} className='justify-content-end'
          direction='horizontal'>
          <Button
            type='submit' variant='primary'>
            Сохранить
          </Button>
          <Link to='..'>
            <Button
              type='button' variant='outline-secondary'>
              Отмена
            </Button>
          </Link>
        </Stack>
      </Stack>
      <Button
        onClick={() => {
          console.log(selectedTags);
        }}
      >
        Что в тегах
      </Button>
    </Form >
  )
}
