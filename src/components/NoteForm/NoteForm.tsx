import { FormEvent, useRef, useState } from 'react';
import { Button, Col, Form, Row, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CreatableReactSelect from 'react-select/creatable'
import { NoteData, Tag } from '../App/App'

type NoteFormProps = {
  onSubmit: (date: NoteData) => void
}

export default function NoteForm({ onSubmit }: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);


  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: [],
    })
  }

  return (
    <Form >
      <Stack
        gap={4}>
        <Row>
          <Col>
            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId='tags'>
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect isMulti
                value={selectedTags.map(tag => {
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
            ref={markdownRef}
            required as={'textarea'} rows={15} />
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
    </Form >
  )
}
