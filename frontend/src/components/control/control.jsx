import React, { useState, useEffect } from 'react';
import './control.css';
import axios from 'axios';
import { Alert } from 'antd';

const Control = () => {
  const [value, setValue] = useState('');
  const [direction, setDirection] = useState('');
  const [trigger, setTrigger] = useState(false);
  const [num, setNum] = useState(0);
  const [warning, setWarning] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [state2, setState2] = useState(false);

  const onKeyDown = (e) => {
    const key = e.key.toUpperCase();
    const allowedKeys = ['W', 'A', 'S', 'D'];
    if (allowedKeys.includes(key)) {
      setValue(key);
      setTrigger(!trigger);
    }
  };

  useEffect(() => {
    if (showWarning) {
      const timer = setTimeout(() => {
        setShowWarning(false);
      }, 1000); // 1秒后关闭警告
      return () => clearTimeout(timer);
    }
  }, [showWarning]);

  useEffect(() => {
    setNum(0); // 每次 `value` 变化时重置 `num`
  }, [value]);

  useEffect(() => {
    const sendDirection = async () => {
      try {
        await axios.post('http://localhost:3001/api/direction', { direction: value });
      } catch (error) {
        console.log(error);
        setWarning('Failed to send direction');
        setShowWarning(true);
      }
    };

    const getSignal = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/signal');
        console.log(response.data);
        setState2(true);
      } catch (error) {
        console.log(error);
        setWarning('Failed to get signal');
        setShowWarning(true);
        setState2(false);
      }
    };

    // Uncomment these if you want to actually call them
    // getSignal();
    // sendDirection();

    // 更新方向
    switch (value) {
      case 'W':
        setDirection('Forward');
        break;
      case 'A':
        setDirection('Left');
        break;
      case 'S':
        setDirection('Backward');
        break;
      case 'D':
        setDirection('Right');
        break;
      default:
        setDirection('Stop');
        break;
    }

    // 递增 num，使用函数式更新以确保 num 正确递增
    setNum((prevNum) => prevNum + 1);
  }, [trigger]);

  return (
    <div className="control">
      <div className="showCase">
        <div className="warning">
          {showWarning && <Alert message={warning} type="error" showIcon />}
        </div>
        <div className="showCaseText">
          {state2 && <div className="text">{`${direction} * ${num}`}</div>}
        </div>
      </div>
      <div className="input">
        <input 
          type="text"
          onKeyDown={onKeyDown}
          value={''}
          placeholder="输入 W, A, S, D 控制方向"
        />
      </div>
    </div>
  );
};

export default Control;
