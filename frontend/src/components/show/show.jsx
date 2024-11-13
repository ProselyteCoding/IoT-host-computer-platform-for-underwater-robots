import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Alert} from 'antd';
import './show.css';

const Show = () => {
    const [data, setData] = useState({
        temperature: 0,
        pressure: 0,
        depth: 0,
        date: ''
    });

    const [sign, setSign] = useState(1);
    const [list, setList] = useState([]);
    const [history, setHistory] = useState([]);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        if (showWarning) {
            Alert.warning('Warning', 'Failed to fetch data from server.');
        }
    },[showWarning])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8800/api/data');
                setData(response.data);

                // 更新历史记录，只保留最近 20 条
                setList(prevList => {
                    const newList = [response.data, ...prevList];
                    return newList.slice(0, 20);
                });
            } catch (error) {
                console.log(error);
                setShowWarning(true);
            }
        };

        //fetchData();

        const timer = setTimeout(() => {
            setSign(!sign);
        }, 10000);

        return () => clearTimeout(timer);
    }, [sign]);

    return (
        <div className="show">
            <div className="text">
                {list.map((item, index) => (
                    <div key={index} className='item'>
                        <div className="temp">Temperature: {item.temperature}</div>
                        <div className="pressure">Pressure: {item.pressure}</div>
                        <div className="depth">Depth: {item.depth}</div>
                        <div className='date'>Date: {item.date}</div>
                    </div>
                ))}
            </div>
            <div className="history">
                <div className='historyText'>
                    {history.map((item, index) => (
                        <div key={index} className='item'>
                            <div>
                                {item}
                            </div>
                        </div >
                    ))}
                </div>
                
            </div>
        </div>
    );
};

export default Show;
