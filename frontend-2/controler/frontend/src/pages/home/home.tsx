import React from'react';
import "./home.scss";
import Shell from '../../component/shell/shell';

const Home = () => {
  return (
    <div className="home">

        <div className='shell'>
            <Shell />
        </div>

        <div className='header'>

        </div>

        <div className='content'>
            <div className='title'>
              Welcome
            </div>
            <div className='text'>
              <div>
                欢迎来到我们的平台！
              </div>
              <div>
                平台支持对提供的文本进行结构化输出，在符合当地的法律法规的前提下，提供对所上传的文本内容的问答、分析、预测等服务。通过左侧的导航栏，开始使用吧！
              </div>
            </div>
        </div>

        <div className='footer'>

        </div>
    </div>
  );
}

export default Home;