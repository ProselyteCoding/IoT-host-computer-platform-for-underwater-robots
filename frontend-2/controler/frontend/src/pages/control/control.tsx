import React from'react';
import "./control.scss"
import Shell from '../../component/shell/shell';
import { useEffect, useState,useRef } from 'react';
import GamePadViewer from '../../component/gamePadViewer/gamePadViewer';

const control: React.FC = () => {

  return (
    <div className="control">
        <div className='shell'>
            <Shell />
        </div>

        <div className='content'>
            <div className='header'>
                Control Panel
            </div>

            <div className='body'>
              <div className='video'>
                <video width="320" height="240" autoPlay>
                  {/* <source src="http://192.168.1.100:8080/video" type="video/mjpeg" /> */}
                </video>
              </div>

              <div className='data'>
                
              </div>
            </div>

            <div className='footer'>
                <div className='control-buttons'>
                  <GamePadViewer />
                </div>
                <div className='status'>

                </div>
            </div>
        </div>
    </div>
  )};

export default control;