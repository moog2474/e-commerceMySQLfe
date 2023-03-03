import React, { useEffect, useState } from 'react'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import MenuNew from './MenuNew'
import { SortableItems } from '../SortableItems';


export default function Menu() {
    const [menu, setMenu] = useState([])
    const [err, setErr] = useState("")
    const [modal, setModal] = useState(false)
    const [isEdited, setIsEdited] = useState(false)
    const [getMenuId, setGetMenuId] = useState('')

    useEffect(() => {
        fetch("http://localhost:8000/be/menu")
            .then(res => res.json())
            .then((data) => {
                // console.log(data.result);
                setMenu(data.result)
                // setMenu(data.result.filter((a) => a.type === "adminMenu"))
            })
            .catch((err) => setErr(console.log(err)))
    }, [])

    const deleteMenu = (id) => {
        fetch(`http://localhost:8000/be/menu/${id}`, {
            method: "DELETE",
            headers: { "Content-type": "application/json" },
        })
            .then(res => res.json())
            .then((data) => {
                // console.log(data.result);
                setMenu(data.result)
            })
            .catch((err) => console.log(err))
    }

    const editMenu = (id) => {
        setModal(!modal)
        setIsEdited(!isEdited)
        setGetMenuId(id)
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setMenu((items) => {
                const activeIndex = items.indexOf(active.id);
                const overIndex = items.indexOf(over.id)

                return arrayMove(items, activeIndex, overIndex)
            })
        }
    }

    return (
        <div>
            <h2 className='col-2 m-2'>
                <button className='btn btn-primary'
                    onClick={() => setModal(!modal)}>Add menu</button>
            </h2>

            <div>
                <table className='w-75'>
                    <thead>
                        <tr className='border-bottom'>
                            <td className='col-1'>#</td>
                            <td className='col-2'>Menu name</td>
                            <td className='col-2'>Type</td>
                            <td className='col-1'>Edit/Delete</td>
                        </tr>
                    </thead>
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <tbody>
                            <SortableContext
                                items={menu}
                                strategy={verticalListSortingStrategy}
                            >
                                {menu.map(({ menuName, id, type, position }, index) => {
                                    return (
                                        <SortableItems key={index} id={position}>
                                            <td className='col-1'>{index + 1}</td>
                                            <td className='col-2'>{menuName}</td>
                                            <td className='col-2'>{type}</td>
                                            <td className='col-1 d-flex w-100 justify-content-center gap-3'>
                                                <AiFillEdit
                                                    onClick={() => editMenu(id)}
                                                    size={20} />
                                                <AiFillDelete
                                                    onClick={() => deleteMenu(id)} size={20} />
                                            </td>
                                        </SortableItems>
                                    )
                                }
                                )}
                            </SortableContext>
                        </tbody>
                    </DndContext>
                </table>

                <MenuNew
                    setModal={setModal}
                    modal={modal}
                    isEdited={isEdited}
                    setIsEdited={setIsEdited}
                    getMenuId={getMenuId}
                    setMenu={setMenu}
                />
            </div >

        </div >
    )
}
