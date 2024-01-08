// 45:00
import { useMemo, useState } from "react";
import { Button, Card, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom"
import ReactSelect from "react-select"
import { Tag } from '../App/App'
import styles from './NoteList.module.css'

type SimplifiedNote = {
  tags: Tag[]
  title: string
  id: string
}

type NoteListProps = {
  availableTags: Tag[]
  notes: SimplifiedNote[]
}

export function NoteList({ availableTags, notes }: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [title, setTitle] = useState('')

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      return (
        title === '' || note.title.toLowerCase().includes(title.toLowerCase())
      ) && (
          selectedTags.length === 0 ||
          selectedTags.every(
            tag => note.tags.some(
              noteTag => noteTag.id === tag.id))
        )
    })
  }, [title, selectedTags, notes])

  return (<>
    <Row className="align-items-center mb-4">
      <Col><h1>Notes</h1></Col>
      <Col xs='auto'>
        <Stack
          gap={2}
          direction="horizontal">
          <Link
            to='/new'>
            <Button variant='primary'>
              Создать</Button></Link>
          <Button variant='ouline-secondary'
          >Редактировать Теги</Button>
        </Stack></Col>
    </Row>
    <Form>
      <Row className="mb-4">
        <Col>
          <Form.Group controlId="title">
            <Form.Label><h2>Title</h2></Form.Label>
            <Form.Control type='text'
              value={title} onChange={e => setTitle(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId='tags'>
            <Form.Label><h2>Tags</h2></Form.Label>
            <ReactSelect isMulti
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
            ></ReactSelect>
          </Form.Group>
        </Col>
      </Row>
    </Form>
    <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
      {filteredNotes.map(note => (
        <Col key={note.id}>
          <NoteCard id={note.id} title={note.title} tags={note.tags} />
        </Col>
      ))}
    </Row>
  </>)
}

export function NoteCard(id, title, tags: SimplifiedNote) {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100">

        </Stack>
        <span className="fs-5">{title}</span>
      </Card.Body>

    </Card>
  )
}
