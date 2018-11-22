

export default (Comp, props) => {
    let {action} = props;
    const didMount = (dom)=>{
        dom.className += ` slide-in-${action}`;
        setTimeout(()=>{
            dom.className += ` slide-in-${action}-active`;
        },0)
    }
    return <Comp {...props} didMount={didMount}/>
};