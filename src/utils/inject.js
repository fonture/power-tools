/*
 * @Author: ouyangdc 
 * @Date: 2018-11-19 09:09:13 
 * @Description: 封装react-redux的connect方法
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-19 10:15:20
 */
import { connect } from '@tarojs/redux'
export default argName => comp => {
    const mapStateToProps = store => {
        console.log(store)
        const arg = store[argName]
        return { 
            [argName]: arg || {}
        }
    }
    return connect(mapStateToProps)(comp)
}