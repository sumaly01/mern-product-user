import React,{useState} from 'react'
import {Typography, Button, Form, message, Input, Icon} from 'antd'; //for styling
import FileUpload from '../../utils/FileUpload'
import Axios from 'axios';

const {Title} = Typography;
const {TextArea} = Input;
const Continents = [
    {key:1, value:"Africa"},
    {key:2, value:"Europe"},
    {key:3, value:"Asia"},
    {key:4, value:"South A"},
    {key:5, value:"North A"},
    {key:6, value:"Austalia"},
    {key:7, value:"Antarctica"}
    

]

//here props means redux ko main wala
function UploadProductPage(props) {

const [TitleValue, setTitleValue] = useState("")
const [DescriptionValue, setDescriptionValue] = useState("")
const [PriceValue, setPriceValue] = useState(0)
const [ContinentValue, setContinentValue] = useState(1)//1 because hamile yo call garda value ma key pass gareko chau instead of actual value like africa
const [Images,setImages] = useState([])

    const onTitleChange=(event) => {
        setTitleValue(event.currentTarget.value)
    }

    const onDescriptionChange=(event) => {
        setDescriptionValue(event.currentTarget.value)
    }

    const onPriceChange=(event) => {
        setPriceValue(event.currentTarget.value)
    }

    const onContinentsSelectChange =(event) => {
        setContinentValue(event.currentTarget.value)
    }

    const updateImages = (newImages) => {
        console.log(newImages)
        setImages(newImages)//FileUpload.js bata ayesko iamge ko array is newImages
    }

    const onSubmit=(event) => {
        event.preventDefault();

        if(!TitleValue || !DescriptionValue || !PriceValue || !Images || !ContinentValue ){
            return alert('fill all the fields')
        }

        const variables={
            writer:props.user.userData._id,//from redux
            title:TitleValue,
            description:DescriptionValue,
            price:PriceValue,
            images:Images,
            continents:ContinentValue
        } 

         Axios.post('/api/product/uploadProduct',variables)
            .then(response => {
                if(response.data.success){
                    alert("successful")
                    props.history.push('/') //redirects to home page

                }else{
                    alert('Failed to upload')
                }
            })
    }

    return (
        <div style={{maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{textAlign:'center', marginBottom:'2 rem'}}>
                <Title level={2}>Upload Travel Product</Title>
            </div>
           
        <Form onSubmit={onSubmit}>


        {/*Dropzone ,refreshFunciton is props*/}
        <FileUpload refreshFunction={updateImages}/>

        <br/>
        <br/>
        <label>Title</label>
        <Input 
            onChange={onTitleChange}
            value={TitleValue}
        />

        <br/>
        <br/>
        <label>Description</label>
        <TextArea
            onChange={onDescriptionChange}
            value={DescriptionValue}
        />

        <br/>
        <br/>
        <label>Price(in $)</label>
        <Input
            onChange={onPriceChange}
            value={PriceValue}
            type="number"
        />

        <select onChange={onContinentsSelectChange}>
            {Continents.map(item => (
                <option key={item.key} value={item.key}>{item.value}</option>
            ))} 
        </select>
        <br/>
        <br/>

        <Button 
            onClick={onSubmit}
        >
            Submit
        </Button>
            

        </Form>
        </div>
    )
}

export default UploadProductPage
