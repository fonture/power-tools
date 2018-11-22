

export default (Comp, props) => {
    let {action} = props;
    const didMount = (dom)=>{
        dom.className += ` slide-in-${action}`;
        process.nextTick(()=>{
            dom.className += ` slide-in-${action}-active`;
        })
        setTimeout(()=>{
            dom.className = '';
        },200)
    }
    return <Comp {...props} didMount={didMount}/>
};