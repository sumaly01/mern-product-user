import React,{useState} from 'react'
import Dropzone from 'react-dropzone' //for photos
import {Icon} from 'antd'
import Axios from 'axios'

function FileUpload(props) {

    const [Images,setImages] = useState([])
    //manage this ie to send the image with other data so we needto manage in parent component ie in UploadProductPage
    const onDrop = (files) => {
        let formData = new FormData()
        const config={
            header:{'content-type' : 'multipart/form-data'}
        }
        formData.append("file",files[0])

        //backend first time
        //photos or file chai server ma save hunu paryo 
        Axios.post('/api/product/uploadImage',formData,config)
            .then(response => {
                if(response.data.success){

                    setImages([...Images, response.data.image])// j cha tyo photo aucha ani aru photos last ma thapincha
                    props.refreshFunction([...Images, response.data.image])
                }else{
                alert('Failed to save the image in server')
                }
            })


    }

    //parent component id UploadProdctPage ma ni garnu parcha
    const onDelete = (image)=> {
        const currentIndex= Images.indexOf(image)
         let newImages=[...Images]// no need for onchange
         newImages.splice(currentIndex,1)//targetted image chuttai array ma gayo
        //newImages consist of all the images except targetted one
         setImages(newImages)
         //parent component id UploadProdctPage ma ni garnu parcha
         //parent component lai 
         props.refreshFunction(newImages)
   }

    return (
        <div style={{display:'flex', justifyContent:'space-between'}}>
            <Dropzone
                onDrop={onDrop}
                multiple={false}
                maxSize={800000000}
            >
                {({getRootProps, getInputProps}) => (
                    <div style={{width:'300px', height:'240px', border:'1px solid lightgray', display:'flex', alignItems:'center', justifyContent:'center'}}
                        {...getRootProps()}
                    >
              
                    <input {...getInputProps()} />
                    <Icon type="plus" style={{ fontSize:'3rem'}} />
                    </div>
                )}

            </Dropzone>

            <div style={{display:'flex', width:'350px', height:'240px', overflowX:'scroll'}}>
               {Images.map((image,index)=> (
                   <div onClick={() => onDelete(image)}>
                       <img style={{minWidth:'300px', width:'300px', height:'240px'}}  src={`http://localhost:5000/${image}`} alt={`productImg-${index}`}/>
                    </div>
               ))}
               
                   
               
            </div>

        </div>
    )
}

export default FileUpload
