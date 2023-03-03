import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Dna, InfinitySpin } from 'react-loader-spinner'



export default function ProductNew({ modalProduct, setModalProduct, getId, isEdited, setIsEdited, products, setProducts }) {


    const init = {
        productName: '',
        price: 0,
        thumbimage: '',
        images: [],
        createdUser: '',
        discount: 0,
        quantity: 0,
        description: ''
    }
    const [product, setProduct] = useState(init)
    const [err, setErr] = useState('')
    const [user, setUser] = useState([])
    const [category, setCategory] = useState([])
    const [loading, setLoading] = useState(false)



    function getData() {
        fetch('http://localhost:8000/be/products')
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                setProducts(data.result)
            })
    }


    function getDataId() {
        fetch(`http://localhost:8000/be/products/${getId}`)
            .then(res => res.json())
            .then((data) => {
                console.log(data.result)
                setProduct(data.result[0])
            })
            .catch((err) => console.log(err))
    }


    useEffect(() => {
        fetch("http://localhost:8000/be/users")
            .then((response) => response.json())
            .then((dt) => {
                setUser(dt.result);
            })
            .catch((err) => setErr(console.log(err)))
    }, [])

    useEffect(() => {
        fetch("http://localhost:8000/be/category")
            .then((response) => response.json())
            .then((dt) => {
                setCategory(dt.result);
            })
            .catch((err) => setErr(console.log(err)))
    }, [])


    useEffect(() => {
        if (isEdited === true) {
            getDataId()
        } else {
            setProduct(init)
        }
    }, [isEdited])


    const addProduct = () => {
        isEdited ?
            fetch(`http://localhost:8000/be/products/${getId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            })
                .then(res => res.json())
                .then((data) => {
                    console.log(data.result)
                    setProduct(init)
                    getData()
                })
                .catch((err) => setErr(console.log(err)))
            :
            fetch("http://localhost:8000/be/products", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            })
                .then(res => res.json())
                .then((data) => {
                    console.log(data.result)
                    setProduct(init)
                    getData()
                })
                .catch((err) => setErr(console.log(err)))
    }

    const sendFile = async (fieldName, files) => {
        setLoading(true)

        console.log(files);
        const url = `https://api.cloudinary.com/v1_1/dnpeugfk4/upload`
        const newArr = []
        for (let i = 0; i < files[0].length; i++) {
            newArr.push(files[0][i])
        }

        const promise = await Promise.all(
            newArr.map((file) => {

                const formData = new FormData()
                formData.append("file", file);
                formData.append("api_key", 433374323371145);
                formData.append("folder", "productImages");
                formData.append("upload_preset", "trivymv8");

                return axios.post(url, formData)
            })
        )
        console.log(promise);
        const arr = []

        promise.map((res) => {
            arr.push(res.data.secure_url)
        });

        if (fieldName == "images") {
            setProduct({ ...product, images: arr })
        }
        else {
            setProduct({ ...product, thumbimage: arr[0] })
        }

        setLoading(false)
    }



    return (
        <div className="modal" style={{ display: modalProduct ? "block" : "none" }}>
            <div className="body product">
                <div className="modal-header">
                    <h1 className="modal-title fs-5 text-warning mb-5 border-bottom" id="staticBackdropLabel">Add product</h1>
                    <button type="button" className="btn-close" onClick={() => {
                        setModalProduct(!modalProduct)
                        setIsEdited(false)
                    }} aria-label="Close"></button>
                </div>
                <div className='d-flex flex-column col text-start'>

                    <div className='col d-flex gap-3 mb-2 justify-content-between align-items-center'>
                        <label>Product Name</label>
                        <input className='w-75' value={product?.productName} type='text'
                            onChange={(e) =>
                                setProduct({ ...product, productName: e.target.value })}></input>
                    </div>

                    <div className='col d-flex gap-3 mb-2 justify-content-between align-items-center'>
                        <label>Discount</label>
                        <input className='w-75' value={product?.discount} type="number"
                            onChange={(e) =>
                                setProduct({ ...product, discount: e.target.value })}></input>
                    </div>

                    <div className='col d-flex gap-3 mb-2 justify-content-between align-items-center'>
                        <label>Price</label>
                        <input className='w-75' value={product?.price} type='number'
                            onChange={(e) =>
                                setProduct({ ...product, price: e.target.value })}></input>
                    </div>

                    <div className='col d-flex gap-3 mb-2 justify-content-between align-items-center'>
                        <label>Quantity</label>
                        <input className='w-75' value={product?.quantity} type='number'
                            onChange={(e) => setProduct({ ...product, quantity: e.target.value })}></input>
                    </div>

                    <div className='col gap-5 mb-2 justify-content-between'>
                        <div className='d-flex justify-content-between align-items-center col-12 mb-2 mt-2'>
                            <label>Thumbnail</label>
                            <input className='w-50'
                                type='file'
                                onChange={(e) => {
                                    console.log(e.target.files)
                                    const arr = []
                                    arr.push(e.target.files)
                                    sendFile("thumbimage", arr)

                                }}
                            >

                            </input>
                            {loading ? <Dna
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="dna-loading"
                                wrapperStyle={{}}
                                wrapperClass="dna-wrapper"
                            /> : ''}

                        </div>
                        <div className='d-flex justify-content-between align-items-center col-12 mt-2 mb-2'>
                            <label>Images</label>
                            <input className='w-50'
                                type='file'
                                multiple
                                onChange={(e) => {
                                    console.log(e.target.files)
                                    const arr = [];
                                    arr.push(e.target.files);
                                    sendFile("images", arr)
                                }}
                            ></input>
                            {loading ? <InfinitySpin
                                width='200'
                                color="#4fa94d"
                            /> : ''}
                        </div>
                    </div>
                    <div className='col d-flex gap-3 mb-2 justify-content-between align-items-center'>
                        <label>Category</label>
                        <select className='w-75'
                            value={product.category}
                            onChange={(e) => setProduct({ ...product, category: e.target.value })}>
                            <option value='0'>Select category</option>
                            {category.map((e) => {
                                return (
                                    <option value={e.categoryNames}>
                                        {e.categoryName}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col d-flex gap-3 mb-2 justify-content-between align-items-center'>
                        <label>Created user</label>
                        <select className='w-75' value={product?.createdUser}
                            onChange={(e) => setProduct({ ...product, createdUser: e.target.value })}>
                            <option value='0'>Select created user</option>
                            {user?.map((e, index) => {
                                if (e.userType == "admin") {
                                    return (
                                        <option value={index + 1}>
                                            {e.userName}
                                        </option>
                                    )
                                }
                            })
                            }
                        </select>
                    </div>
                    <div className='col d-flex gap-3 mb-2 justify-content-between align-items-center'>
                        <label>Description</label>
                        <textarea className='w-75' value={product?.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}></textarea>
                    </div>
                    <button onClick={() => {
                        addProduct()
                        setModalProduct(false)
                    }} className='btn btn-primary'>save</button>
                </div>
            </div>
        </div >

    )
}

