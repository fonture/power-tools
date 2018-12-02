/*
 * @Author: ouyangdc 
 * @Date: 2018-11-19 09:09:13 
 * @Description: 封装react-redux的connect方法
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-30 15:43:55
 */
import { connect } from '@tarojs/redux'
export default (...args) => comp => {
    const mapStateToProps = store => {
        const props = {}
        args.forEach(element => {
            props[element] = store[element] || {}
        })
        return props
    }
    return connect(mapStateToProps)(comp)
}