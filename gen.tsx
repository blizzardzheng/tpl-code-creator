import React from 'react';
import './style.less';
import FlexCenterContainer from '@/components/FlexCenterContainer';


interface IProps {
    /*
    * dfgdgdgdfg
    */
    234?: string;
}
export const RewardList: React.FC<IProps> = (props) => {
  return (<FlexCenterContainer>
<div className="main">
  <span className="title">
      签到成功!
    </span>
    <span className="caption">
      获得神秘礼包
    </span>
    <img className="banner" src="https://img.alicdn.com/imgextra/i1/O1CN01I3O6Pg1GEioxNjx8L_!!6000000000591-2-tps-1040-460.png"/>
    <div className="title-wrapper">
    <span className="title-1">
        开心收下
      </span>
    </div>
    <span className="info">
      可在我的奖品中查看
    </span>
  </div>
<img className="large-icon" src="https://img.alicdn.com/imgextra/i2/O1CN01FPTVE31q2eYKPr3Iq_!!6000000005438-2-tps-120-120.png"/>
</FlexCenterContainer>);
};