import React, { Fragment, useState, useEffect } from 'react'
import Pagination from 'react-js-pagination'
import slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import MetaData from './layout/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { gerProducts } from '../actions/productActions'
import Product from './product/product'
import Loader from './layout/Loader'
import { useAlert } from 'react-alert';

const { createSliderWithTooltip } = slider
const Range = createSliderWithTooltip(slider.Range)
const Home = ({ match }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([1, 1000])
    const [category, setCategory] = useState('')
    const categories = [
        'Electronics',
        'Cameras',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        "Books",
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'

    ]

    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, products, error, productCount, resPerPage } = useSelector(state => state.products)
    const keyword = match.params.keyword
    useEffect(() => {
        if (error) {
            return alert.error(error)
        }
        dispatch(gerProducts(keyword, currentPage, price, category));

    }, [dispatch, alert, error, keyword, currentPage, price, category])

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }
    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>

                    <MetaData title={`Buy Best Product Online `}></MetaData>

                    <h1 id="products_heading">Latest Products</h1>
                    <section id="products" className="container mt-2">
                        <div className="row">
                            {keyword ? (
                                <Fragment>
                                    <div className="col-6 col-md-3 mt-5 mb-5">
                                        <div className="px-5">
                                            <Range
                                                marks={{
                                                    1: `$1`,
                                                    1000: `$1000`
                                                }}
                                                min={1}
                                                max={1000}
                                                defaultValue={[1, 1000]}
                                                tipFormatter={value => `$${value}`}
                                                tipProps={{
                                                    placement: "top",
                                                    visible: true
                                                }}
                                                value={price}
                                                onChange={price => setPrice(price)}
                                            />
                                            <hr className="my-5" />
                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    categories
                                               </h4>
                                                <ul className="p1-0">
                                                    {categories.map(category => (
                                                        <li
                                                            style={{
                                                                cursor: 'pointer',
                                                                listStyleType: 'none'
                                                            }}
                                                            key={category}
                                                            onClick={() => setCategory(category)}
                                                        >
                                                            {category}

                                                        </li>
                                                    ))}

                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            {
                                                products.map(product => (
                                                    <Product key={product._id} product={product} col={4} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (
                                products && products.map(product => (

                                    <Product key={product._id} product={product} col={3} />

                                ))
                            )}

                        </div>
                    </section>
                    <div className="d-flex justify-content-center mt-5">
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={productCount}
                            totalItemsCount={productCount}

                            onChange={setCurrentPageNo}
                            nextPageText={'Next'}
                            prevPageText={'Prev'}
                            firstPageText={'First'}
                            lastPageText={'Last'}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                    </div>
                </Fragment>
            )}

        </Fragment>
    )
}

export default Home