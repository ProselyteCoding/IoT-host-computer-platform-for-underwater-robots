import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Alert} from 'antd';
import './show.css';

const Show = () => {
    const [data, setData] = useState([]);

    const [sign, setSign] = useState(1);
    const [sign2, setSign2] = useState(1);
    const [history, setHistory] = useState([]);
    const [showWarning, setShowWarning] = useState(false);
    const [warning, setWarning]= useState('');

    useEffect(() => {
        if (showWarning) {
            const timer = setTimeout(() => {
                setShowWarning(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    },[showWarning])

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://localhost:8800/api/motion/getOperations');
                setHistory(response.data.slice(-20));
            } catch (error) {
                console.log(error);
                setWarning('Failed to fetch history');
                setShowWarning(true);
            }
        };

        fetchHistory();
        
        const timer = setTimeout(() => {
            setSign2(!sign2);
        }, 100);

        return () => clearTimeout(timer);
    },[sign2]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8800/api/data/get');
                // 更新历史记录，只保留最近 20 条
                setData(response.data.slice(-20));
                //console.log(response.data);
            } catch (error) {
                console.log(error);
                setWarning('Failed to fetch data');
                setShowWarning(true);
            }
        };

        

        fetchData();

        const timer = setTimeout(() => {
            setSign(!sign);
        }, 10000);

        return () => clearTimeout(timer);
    }, [sign]);

    return (
        <div className="show">
            <div className='Alert'>
                {showWarning && <Alert message={`${warning}`} type="error" showIcon />}
            </div>
            <div className="text">
                {data.map((item, index) => (
                    <div key={index} className='item'>
                        <div className="temp">Temperature: {item.temperature}</div>
                        <div className="pressure">Pressure: {item.pressure}</div>
                        <div className="depth">Depth: {item.depth}</div>
                        <div className='date'>Time: {item.time}</div>
                    </div>
                ))}
            </div>

            <div className="history">
                <div className='historyText'>
                    {history.map((item, index) => (
                        <div key={index} className='item'>
                            <div className="motion">Motion: {item.motion}</div>
                            <div className="time">Time: {item.time}</div>
                        </div >
                    ))}
                </div>
                
            </div>
        </div>
    );
};

export default Show;