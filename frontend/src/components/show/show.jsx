import React,{useState,useEffect} from'react';
import axios from 'axios';
import './show.css';

const Show = () => {
    const [data,setData] = useState(
        {
            tempureture:0,
            pressure:0,
            deepth:0
        }
    );
    const [sign,setSign] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get('http://localhost:3000/api/data')
               .then(response => {
                    setData(response.data);
                })
            }catch(error){
                console.log(error);
            }
        };

        //fetchData();

        const {tempureture,pressure,deepth} = data;

        const timer = setTimeout(() => {
            setSign(!sign);
        },10000);

        return () => clearTimeout(timer);
        
        
    }, [sign]);

    return (
        <div className="show">
            <div className='text'>
                <div className='temp'>temperature:{data.tempureture}</div>
                <div className='pressure'> pressure:{data.pressure}</div>
                <div className='deepth'>deepth:{data.deepth}</div>
            </div>
        </div>
    );
};

export default Show;