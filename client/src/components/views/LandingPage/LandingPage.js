
import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { Icon, Col, Card, Row } from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox'
import RadioBox from './Sections/RadioBox'
import {continents,price} from './Sections/Datas'
import SearchFilter from './Sections/SearchFilter'
const { Meta } = Card;

//skip and limit chai display grna lai ho 
// function LandingPage() {
   
//    const[Products,setProducts] = useState([])
//     const[Skip,setSkip] = useState(0)
//     const[Limit,setLimit] = useState(8)

//     //es7 
//    //useEffect in funcitonal component is same like componentDidMount in class component
//    //so tei bhayera post req pathako getProducts ma
//     useEffect(() => {

//         const variables = {
//             skip: Skip,
//             limit: Limit
//         }
//         //first 8 jancha
//         getProducts(variables)
//     }, [])


//     const getProducts = (variables) => {
//         Axios.post('/api/product/getProducts',variables)
//         .then(response => {
//             if(response.data.success){
//                   setProducts([...Products,response.data.products])//same name hunu parcha
//                   //all products are displayed
//                   console.log(response.data.products)
//             }else{
//                 alert('Failed to fetch the product data from server')
//             }
//         })
//     }


//     const onLoadMore = () => {
//         let skip = Skip + Limit
        
//         //variables is differemt from that of useEffect()
//         const variables = {
//             skip: skip,
//             limit: Limit
//         }
//         getProducts(variables)


//     }






    // function LandingPage() {
   
    //     const[Products,setProducts] = useState([])
    //      const[Skip,setSkip] = useState(0)
    //      const[Limit,setLimit] = useState(8)
     
    //      //es7 
    //     //useEffect in funcitonal component is same like componentDidMount in class component
    //     //so tei bhayera post req pathako getProducts ma
    //      useEffect(() => {
     
    //          const variables = {
    //              skip: Skip,
    //              limit: Limit
    //          }
    //          //first 8 jancha
    //          Axios.post('/api/product/getProducts',variables)
    //          .then(response => {
    //              if(response.data.success){
    //                    setProducts(response.data.products)//same name hunu parcha
    //                    //all products are displayed
    //                    console.log(response.data.products)
    //              }else{
    //                  alert('Failed to fetch the product data from server')
    //              }
    //          })
    //      }, [])
     
     
         
     
    //      const onLoadMore = () => {
    //          let skip = Skip + Limit
             
    //          //variables is differemt from that of useEffect()
    //          const variables = {
    //              skip: skip,
    //              limit: Limit
    //          }
    //          Axios.post('/api/product/getProducts',variables)
    //          .then(response => {
    //              if(response.data.success){
    //                    setProducts([...Products,response.data.products])//same name hunu parcha
    //                    //all products are displayed
    //                    console.log(response.data.products)
    //              }else{
    //                  alert('Failed to fetch the product data from server')
    //              }
    //          })
     
     
    //      }
     




    function LandingPage() {

        const [Products, setProducts] = useState([])
        const [Skip, setSkip] = useState(0)
        const [Limit, setLimit] = useState(8)
        const [PostSize,setPostSize] = useState(0) //loadmore button kati bela dekhaune bhanera
        const [SearchTerms, setSearchTerms] = useState("")
    
        const [Filters, setFilters] = useState({
            continents: [], //console.log garda array return garcha in handleFilters
            price: []
        })
    
        useEffect(() => {
    
            const variables = {
                skip: Skip,
                limit: Limit,
            }
    
            getProducts(variables)
            
        }, [])
    
        const getProducts = (variables) => {
            Axios.post('/api/product/getProducts', variables)
                .then(response => {
                    if (response.data.success) {
                        if (variables.loadMore) {
                            setProducts([...Products, ...response.data.products])
                        } else {
                            setProducts(response.data.products)
                        }

                        setPostSize(response.data.postSize)
                        
                    } else {
                        alert('Failed to fectch product datas')
                    }

                    // console.log(Products)
                })
        }
    
        const onLoadMore = () => {
            let skip = Skip + Limit;
    
            const variables = {
                skip: skip,
                limit: Limit,
                loadMore: true,
                filters: Filters,
                searchTerm: SearchTerms
            }
            getProducts(variables)
            setSkip(skip)
        }
    




    const renderCards = Products.map((product,index)=> {
        //Col means column euta photo lai
        return <Col lg={6} md={8} xs={24}>
            <Card
                hoverable={true}
                cover={<ImageSlider images={product.images} />}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>

    })

    const showFilteredResults= filters =>{

        const variables = {
            skip:0,
            limit:Limit,
            filters:filters
        }
        getProducts(variables)

        //feri first dekhi dekhauna setskip(0) gareko
        setSkip(0)
    }

    //to get array from Data.js in price
    const handlePrice=(value)=>{
        const data=price//price is from data.js
        let array = []

        for(let key in data){
            // if(data[key]._id)
            console.log('key',key)//[0,1,2,3,4,5] ie _id of all
            console.log('value',value)//particular tick gareko ko matra _id huncha value ma

            if(data[key]._id === parseInt(value,10)){
                //if tick gareko wala matches with key ko _id ie all then array return garne
                array=data[key].array
            }
        }
        console.log('array',array)
        return array
    }

    const handleFilters = (filters,category ) => {
        console.log(filters) //logs [1,2,7...] ie _id
        const newFilters = {...Filters}
        console.log(newFilters)

        newFilters[category]=filters
        //just like newFilters[category]= [1,4,3]

        if(category === "price"){
            let priceValues=handlePrice(filters)
            //priceValues ma tick gareko price ko array aucha
            newFilters[category]=priceValues
        }

        console.log(newFilters)
        showFilteredResults(newFilters)
        setFilters(newFilters)

    }

    const updateSearchTerms = (newSearchTerm) => {

        const variables = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerms(newSearchTerm)

        getProducts(variables)
    }



    return (
        <div style={{width:'75%', margin:'3rem auto'}}>
           <div style={{textAlign:'center'}}>
               <h2>Let's travel anywhere <Icon type="rocket"/></h2>
           </div>


            {/* Filter*/}
            <Row gutter={[16,16]}>
                <Col lg={12} xs={24}>
                    {/*updating in parent component &filters contain _id*/}
                    <CheckBox
                        list={continents}//from Datas.js
                        handleFilters={filters => handleFilters(filters,"continents")} 
                     //filters bhaneko CheckBox.js id child component ko newChecked ho
                    />
                </Col>
                    
                <Col lg={12} xs={24}>
                    {/*updating in parent component &filters contain _id */}
                    <RadioBox
                        list={price} //from Datas.js
                        handleFilters={filters => handleFilters(filters,"price")} 
                    />
                </Col>
            </Row>
              

            {/*SEarch */}
            <div style={{display:'flex', justifyContent:'flex-end',margin:'1rem auto'}}>
               
                <SearchFilter 
                    refreshFunction={updateSearchTerms}
                />
            </div>
            

            
            {Products.length === 0 ?
                <div style={{display:'flex', height:'300px', justifyContent:'center' , alignItems:'center'}}>
                <h2>No posts yet...</h2>
                </div>   :

                <div>
                    <Row gutter={16,16}>{/*row gutter for margin */}
                        
                        {/*renderCards call huncha */}
                        {renderCards}
                    </Row>


                </div>
            }
            <br/><br/>


            {PostSize >= Limit && 
                <div style={{display:'flex', justifyContent:'center'}}>
                <button onClick={onLoadMore}>Load More</button>
                </div>
            }
                

        </div>
    )
}

export default LandingPage
