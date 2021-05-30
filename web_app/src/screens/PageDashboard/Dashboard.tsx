import React, { useEffect, useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { css } from '@emotion/css'
import { useMutation, useQuery } from '@apollo/client'
import {
  Button, Form, message, Modal, Result, Spin,
} from 'antd'
import TaskNew from 'screens/TaskNew'
import { DASHBOARD_TASK_COLUMNS } from 'appConstants'
import { ARCHIVE_TASK, CHANGE_STATE, GET_TASKS } from 'queries'
import TaskAddAssigneers from 'screens/TaskItem/TaskAddAssigneers'
import { gSelectedBoard } from 'appState/appState'
import { GetTasks } from 'queries/types/GetTasks'
import ArchiveTask from './ArchiveTask'
import Column from './Column'

const stylesColumns = css`
  margin-top: 3px;
  display: flex;
  overflow-x: auto;
  width: 100%;
  margin-bottom: 20px;
`

const groupTasksByState = (tasks: any) => tasks.reduce((accum: any, task: any) => ({
  ...accum,
  [task.state]: {
    id: task.state,
    list: [
      ...(accum[task.state] && (accum[task.state].list || [])),
      task,
    ],
  },
}), { ...DASHBOARD_TASK_COLUMNS })


function Dashboard() {
  const board = gSelectedBoard()
  const { loading: tasksLoading, data: tasksData, error: tasksError } = useQuery<GetTasks>(GET_TASKS, {
    variables:
    {
      filter: { isArchived: false, board: board?.id },
    },
  })

  const [changeTaskState] = useMutation(CHANGE_STATE)
  const [archiveTask] = useMutation(ARCHIVE_TASK)


  const [form] = Form.useForm()
  const [columns, setColumns] = useState(DASHBOARD_TASK_COLUMNS)
  const [assignTaskTaskModalParams, setAssignTaskTaskModal] = useState<{ taskId: string, previousColumnsState: any } | null>(null)
  const [showNewTaskModal, setNewTaskModal] = useState(false)

  useEffect(() => {
    if (!tasksData) return
    const { tasks } = tasksData
    const groupedTasks: any = groupTasksByState(tasks)
    setColumns(groupedTasks)
  }, [tasksData])

  const onCreate = async () => {
    form.submit()
    setNewTaskModal(false)
  }

  const onTaskNew = () => {
    setNewTaskModal(true)
  }

  const onDragEnd = async ({
    source, destination, draggableId
  }: DropResult) => {
    // Make sure we have a valid destination
    // Make sure we're actually moving the item
    if (
      destination === undefined
      || destination === null
      || !['TO_ARCHIVE', ...Object.keys(DASHBOARD_TASK_COLUMNS)].includes(destination.droppableId)
      || (source.droppableId === destination.droppableId
      && destination.index === source.index)
    ) return

    if (destination.droppableId === 'TO_ARCHIVE') {
      // archive item
      archiveTask({
        variables: {
          id: draggableId,
        },
        refetchQueries: ['GetTasks'],
      }).then(() => {
        message.success('Task has been archived!')
      })
      return
    }

    // Set start and end variables
    const start = (columns as any)[source.droppableId]
    const end = (columns as any)[destination.droppableId]

    // const start = columns['todo']
    // const end = columns['todo']

    // If start is the same as end, we're in the same column
    if (start?.id === end?.id) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.list.filter(
        (_: any, idx: number) => idx !== source.index,
      )
      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index])
      // Then create new copy of the column object
      const newCol = {
        id: start.id,
        list: newList,
      }
      // Update the state
      setColumns((state) => ({ ...state, [newCol.id]: newCol }))
      return
    }
    // If start is different from end, we need to update 2 columns
    // Filter the start list like before
    const newStartList = start.list.filter(
      (_: any, idx: number) => idx !== source.index,
    )

    // Create new start column
    const newStartCol = {
      id: start.id,
      list: newStartList,
    }
    // Make a new end list array
    const newEndList = [...end.list]
    // Insert the item into the end list
    newEndList.splice(destination.index, 0, start.list[source.index])

    // Create new end column
    const newEndCol = {
      id: end.id,
      list: newEndList,
    }
    if (destination.droppableId === DASHBOARD_TASK_COLUMNS.IN_PROGRESS.id && source.droppableId === DASHBOARD_TASK_COLUMNS.TODO.id) {
      setAssignTaskTaskModal({
        taskId: draggableId,
        previousColumnsState: { ...columns },
      })
    }
    changeTaskState({
      variables: {
        id: draggableId,
        state: end.id,
      },
      refetchQueries: ['GetTasks'],
    }).then(() => {
      message.success(`Task has been moved to ${end.id}!`)
    })
    // Update the state
    setColumns((state) => ({
      ...state,
      [newStartCol.id]: newStartCol,
      [newEndCol.id]: newEndCol,
    }))
  }

  const selectedBoard = gSelectedBoard()
  if (tasksLoading || !selectedBoard) return <Spin />
  if (tasksError) {
    return (
      <Result
        status="warning"
        title="There are some problems with your operation."
        extra={(
          <a href="/">
            go to main page
          </a>
        )}
      />
    )
  }

  const { title: boardTitle } = selectedBoard

  return (
    <>
      {Boolean(assignTaskTaskModalParams) && (
        <Modal
          maskClosable={false}
          onCancel={() => {
            setColumns(assignTaskTaskModalParams?.previousColumnsState)
            setAssignTaskTaskModal(null)
          }}
          title="Do you want to change assigneers?"
          visible
          footer={false}
        >
          <TaskAddAssigneers
            id={assignTaskTaskModalParams!.taskId}
            onFinish={() => setAssignTaskTaskModal(null)}
          />
        </Modal>
      )}
      { showNewTaskModal && (
        <Modal
          maskClosable={false}
          onCancel={() => {
            setNewTaskModal(false)
          }}
          title="Create task"
          visible
          footer={(
            <div className={css`display: flex; justify-content: space-between;`}>
              <Button
                type="primary"
                ghost
                onClick={() => {
                  setNewTaskModal(false)
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                ghost
                onClick={onCreate}
              >
                Create
              </Button>
            </div>
          )}
        >
          <TaskNew boardId={board!.id} form={form} footer={null} />
        </Modal>
      )}
      <div
        className={css`
          width: calc(100vw - 230px);
          margin-left: 30px;
       
          margin-top: 18px;
          height: calc(100% - 70px);
        `}
      >
        <div className={
          css`
            display: flex;
            justify-content: space-between;
          `
        }
        >
          <div>
            <h2
              className={css`
              display: inline-block;
              `}
            >
              {boardTitle}
              {' '}
              |
            </h2>
            {' '}
            {tasksData?.tasks?.length}
            {' '}
            active task(s)
          </div>
          <Button
            size="large"
            type="primary"
            ghost
            onClick={onTaskNew}
            className={css`margin-right: 30px;`}
          >
            New task
          </Button>
        </div>
        <div className={stylesColumns}>
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.values(columns).map((col: any) => (
              <Column col={col} key={col.id} />
            ))}
            <ArchiveTask />
          </DragDropContext>
        </div>
      </div>
    </>
  )
}

export default Dashboard
