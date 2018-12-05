/*
 * @Author: ouyangdc 
 * @Date: 2018-11-19 09:09:13 
 * @Description: 封装react-redux的connect方法
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-05 15:21:56
 */
import { connect } from '@tarojs/redux'
export default (...args) => comp => {
    const mapStateToProps = store => {
        const props = {}
        args.forEach(element => {
            props[element] = store[element]
        })
        return props
    }
    const mapDispatchToProps = (dispatch, props) => {}
    return connect(mapStateToProps, mapDispatchToProps)(comp)
}