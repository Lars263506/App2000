import { useEffect, useState, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'

import Image from 'next/image'
import '../../app/globals.css'
import 'react-toastify/dist/ReactToastify.css'

import Announcement from './announcements'
import FieldInformation from './fieldinformation'
import MemberList from './memberlist'
import Button from '../global/button'

/**
 * @author Andreas Nilsen and Lars Andreas Strand
 * @description This component is the toolbox for the club page. It contains the different components that can be added to the club page.
 * @disclaimer Much of the code in this file is inspired by ChatGPT and Copilot.
 */

interface ComponentGroups {
  nonmemberElements: Component[]
  memberElements: Component[]
}

interface ToolboxProps {
  clubId: string | undefined
}

interface Component {
  type: string
  uniqueId: number
  x: number
  y: number
  width: number
  height: number
  text: string
  _id?: string
}

const Toolbox: React.FC<ToolboxProps> = ({ clubId }) => {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [componentGroups, setComponentGroups] = useState<ComponentGroups>({ nonmemberElements: [], memberElements: [] })
  const [components, setComponents] = useState<Component[]>([])
  const [currentView, setCurrentView] = useState('')
  const [isToolboxOpen, setIsToolboxOpen] = useState(false)
  const [editRights, setEditRights] = useState(false)

  const dropZoneRef = useRef<HTMLDivElement>(null)

  /**
     * Runs when the component is mounted.
     * Fetches the view and elements for the club page, and checks if the user has edit rights.
     */
  useEffect(() => {
    if (clubId) {
      const fetchData = async () => {
        await checkEditRights()
        await fetchElements()
        await getView()
      }
      fetchData()
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'auto'
      }
    }
  }, [clubId])

  /**
     * Runs when the current view is changed.
     * Updates the components to the new view.
     */
  useEffect(() => {
    if (currentView === 'nonmember') { setComponents(componentGroups.nonmemberElements) } else if (currentView === 'member') { setComponents(componentGroups.memberElements) }
  }, [currentView, componentGroups])

  const getView = async () => {
    const accessToken = localStorage.getItem('accessToken')
    const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/clubpage/view/' + clubId

    const response = await fetch(url, {
      method: 'GET',
      headers: accessToken ? { Authorization: 'Bearer ' + accessToken } : {}
    })

    const data = await response.json()
    setCurrentView(data.view)
  }

  const fetchElements = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/element/' + clubId

      const response = await fetch(url, {
        method: 'GET',
        headers: accessToken ? { Authorization: 'Bearer ' + accessToken } : {}
      })

      const data: ComponentGroups = await response.json()

      setComponentGroups(data)
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const checkEditRights = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/users/permissions'

      const response = await fetch(url, {
        method: 'GET',
        headers: accessToken ? { Authorization: 'Bearer ' + accessToken } : {}
      })

      const data = await response.json()
      setEditRights(data.canEditClubPage)
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const handleMouseDown = (e: React.MouseEvent, component: Component) => {
    e.stopPropagation()

    setSelectedComponent(component)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (selectedComponent == null) return

    e.preventDefault()

    const dropZone = dropZoneRef.current?.getBoundingClientRect()
    if (dropZone == null) return

    const xPercent = e.clientX / dropZone.width
    const yPercent = e.clientY / dropZone.height
    const width = 0
    const height = 0

    const newComponent: Component = {
      ...selectedComponent,
      x: xPercent,
      y: yPercent,
      width,
      height
    }

    const exists = components.some(comp => comp.uniqueId === selectedComponent.uniqueId)

    setComponentGroups(prevGroups => {
      if (currentView === 'nonmember') {
        return {
          ...prevGroups,
          nonmemberElements: [
            ...prevGroups.nonmemberElements.filter(component => component.uniqueId !== selectedComponent.uniqueId),
            newComponent
          ]
        }
      } else if (currentView === 'member') {
        return {
          ...prevGroups,
          memberElements: [
            ...prevGroups.memberElements.filter(component => component.uniqueId !== selectedComponent.uniqueId),
            newComponent
          ]
        }
      }
      return prevGroups
    })

    if (exists) {
      updateElement(newComponent)
    } else {
      createNewElement(newComponent)
    }

    setSelectedComponent(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDelete = async () => {
    if (selectedComponent == null) return

    setComponents(prevComponents => prevComponents.filter(component => component.uniqueId !== selectedComponent.uniqueId))

    try {
      const accessToken = localStorage.getItem('accessToken')
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/element/' + clubId

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          view: currentView,
          uniqueId: selectedComponent.uniqueId
        })
      })

      if (response.ok) toast.success('Element deleted successfully')
      else toast.error('Failed to delete element')
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
    }

    setSelectedComponent(null)
  }

  const createNewElement = async (element: Component) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/element/' + clubId

      await fetch(url, {
        method: 'POST',
        headers: accessToken ? { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' } : {},
        body: JSON.stringify({ ...element, view: currentView })
      })

      toast.success('Element created successfully')

      setComponentGroups(prevGroups => {
        if (currentView === 'nonmember') {
          return {
            ...prevGroups,
            nonmemberElements: [...prevGroups.nonmemberElements, element]
          }
        } else if (currentView === 'member') {
          return {
            ...prevGroups,
            memberElements: [...prevGroups.memberElements, element]
          }
        }
        return prevGroups
      })
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const updateElement = async (element: Component) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/element/' + clubId

      const { text, _id, ...request } = element

      await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...request, view: currentView })
      })

      setComponentGroups(prevGroups => {
        if (currentView === 'nonmember') {
          return {
            ...prevGroups,
            nonmemberElements: prevGroups.nonmemberElements.map(comp => comp.uniqueId === element.uniqueId ? element : comp)
          }
        } else if (currentView === 'member') {
          return {
            ...prevGroups,
            memberElements: prevGroups.memberElements.map(comp => comp.uniqueId === element.uniqueId ? element : comp)
          }
        }
        return prevGroups
      })

      toast.success('Element updated successfully')
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const renderComponent = (component: Component) => {
    const dropZone = dropZoneRef.current?.getBoundingClientRect()

    if (dropZone == null) return null

    return (
      <div
        key={component.uniqueId}
        id={`component-${component.uniqueId}`}
        style={{
          position: 'absolute',
          left: `${dropZone.width * component.x}px`,
          top: `${dropZone.height * component.y}px`
        }}
        className={`border-2 ${component.uniqueId === selectedComponent?.uniqueId ? 'border-red-200' : ''}`}
        onMouseDown={editRights ? (e) => handleMouseDown(e, component) : undefined}
        draggable={editRights}
      >
        {component.type === 'announcement' && <Announcement uniqueId={component.uniqueId} text={component.text} editRights={editRights} />}
        {component.type === 'fieldInformation' && <FieldInformation />}
        {component.type === 'memberList' && <MemberList />}
      </div>
    )
  }

  /**
     * @returns The toolbox component.
     * @description The toolbox component contains the different components that can be added to the club page.
     */
  return (
    <div className='flex h-screen'>
      {editRights && (
        <button
          className='absolute top-20 left-2 p-2 bg-grey-400 text-white rounded'
          onClick={() => setIsToolboxOpen(!isToolboxOpen)}
        >
          <Image
            src={isToolboxOpen ? '/bx-window-close.svg' : '/bx-window-open.svg'}
            alt='Toolbox Icon'
            width={24}
            height={24}
          />
        </button>
      )}
      {isToolboxOpen && (
        <div className='w-80% bg-gray-200 mb-20 flex flex-col justify-between'>
          <div className='p-4 border'>
            <h3 className='text-lg font-bold mb-4 mt-8'>Verktøykasse</h3>
            {['announcement', 'fieldInformation', 'memberList'].map((type) => (
              <div
                key={type}
                className='p-3 bg-gray-400 border rounded-lg cursor-pointer mt-10'
                draggable
                onMouseDown={(e) => handleMouseDown(e, {
                  type,
                  uniqueId: Date.now(),
                  x: 0,
                  y: 0,
                  width: 0,
                  height: 0,
                  text: ''
                })}
              >
                {type === 'announcement' && 'Kunngjøringer'}
                {type === 'fieldInformation' && 'Baneinformasjon'}
                {type === 'memberList' && 'Medlemsliste'}
              </div>
            ))}
          </div>

          {/* Buttons to switch between nonmember and member view */}
          <div className='flex mt-4 p-4 border-t'>
            <Button
            >
              Ikke-medlem
            </Button>
            <button
              className={`p-2 border rounded-lg cursor-pointer ${currentView === 'member' ? 'bg-blue-400' : ''}`}
              onClick={() => setCurrentView('member')}
            >
              Medlem
            </button>
          </div>
        </div>
      )}

      {/* Dropzone */}
      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={() => setSelectedComponent(null)}
        className='bg-gray-200 w-full border-2 border-black rounded-lg ml-1 mr-1 mb-20 mt-2'
      >
        {components.map(renderComponent)}
      </div>

      {/* Delete button */}
      {(selectedComponent != null) && (
        <div className='absolute bottom-4 right-4 p-2 bg-red-500 text-white rounded cursor-pointer' onClick={handleDelete}>
          Slett figur
        </div>
      )}
      <ToastContainer />
    </div>
  )
}

export default Toolbox
