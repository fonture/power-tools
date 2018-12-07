import { Component } from '@tarojs/taro'
import classNames from 'classnames'
import { AtCard } from 'taro-ui'
import './index.less'


export default class Card extends Component {
  render() {
      const { showHeader, showBody, isFull, className, children, ...rest } = this.props;

      const rootClass = classNames(
        {
          'at-card--full': isFull,
          'no-card-header': !showHeader,
          'no-card-body': !showBody,
        },
        className
      )

      return (
          <AtCard
            className={rootClass}
            {...rest}
          >
            {children}
          </AtCard>
      )
  }
}
