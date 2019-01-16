class Canvas2D {
    constructor(options){
        this.dom = document.querySelector(options.selector)
        this.ctx = this.dom.getContext('2d');

        this.dom.width = this.width = options.width;
        this.dom.height = this.height = options.height;

        this.pointX = 0;
        this.pointY = 0;

        this.centerX = options.width / 2;
        this.centerY = options.height / 2;

        // 内置变量 
        // this.$style = null;  // 此属性唯一
        // this.$gradient_name = null;  // name 根据创建渐变的名称进行递增保存。
    }
    // 移动端高清版本的canvas;
    canvasHD(zoom){
        this.dom.width = this.width * zoom;
        this.dom.height = this.height * zoom;
        this.ctx.scale(zoom,zoom)
        this.dom.style.zoom = 1 / zoom;
    }
    // 位置操作
    moveCoord(options){
        if(options === 'center'){
            this.ctx.translate(this.centerX,this.centerY);
        }else if(options === 'origin' || !options){
            this.ctx.translate(0,0);
        }else{
            this.ctx.translate(options.x,options.y);
        }
    }
    // 清空画布
    clearRect(options){
        if(options === 'all'){
            this.ctx.clearRect(0,0,this.dom.width,this.dom.height);
        }   
    }
    // 创建颜色
    renderStyle(style){
        this.$style = style;
        // 作用是在需要创建相同颜色的地方指定同样的样式
        this.ctx.fillStyle = this.getGradient(style);
        this.ctx.strokeStyle = this.getGradient(style);
    }
    // 创建渐变
    createGradient(options){
        let defaultOptions = {
            name:'',             // 渐变名称
            type:'linear',       // 类型  radial 
            start:{x:0,y:0,r:0},
            end:{x:0,y:0,r:0},
            lumps:[
                { section:0.0, color:'rgba(255,255,255,0)'},
                { section:0.5, color:'rgba(255,255,255,0.5)'},
                { section:0.7, color:'rgba(255,255,255,0.7)'},
                { section:1.0, color:'rgba(255,255,255,1)'}
            ]
        }

        let params = Object.assign(defaultOptions, options);
        // 是否传递了名字
        if(!params.name){
            throw new Error(`create gradient need the parameter 'name'`);
        }
        // 名字是否重用
        if(this[`$gradient_${params.name}`]){
            throw new Error(`the Gradient name '${params.name}' is already defined `);
        }
        let gradient = null;
        if(params.type === 'linear'){
            gradient = this.ctx.createLinearGradient(
                params.start.x,
                params.start.y,
                params.end.x,
                params.end.y
            );
        }else{
            gradient = this.ctx.createRadialGradient(
                params.start.x,
                params.start.y,
                params.start.r,
                params.end.x,
                params.end.y,
                params.end.r
            );
        }
        // 添加区间颜色
        params.lumps.forEach(item => {
            gradient.addColorStop(item.section, item.color);
        });
    
        this[`$gradient_${params.name}`] = gradient;
    }
    // 绘制矩形
    drawReac(options){
        
    }
    // 绘制线条
    drawLiner(options){

    }
    // 绘制圆弧
    drawArc(options){
        
    }
    // 获取渐变
    getGradient(name){
        if(/^\#|(rgb)/.test(name)){
            return name;
        }
        if(!this[`$gradient_${name}`]) {
            throw new Error(`the gradient name '${name}' is not defined `);
        }else{
            return this[`$gradient_${name}`];
        }
    }
    // 绘制圆形 或者 圆环
    drawCircle(options){
        let defaultOptions = {
            radius: 50,             //半径
            type:'stroke',          // fill 圆形  stroke 圆环
            width:5,                // 圆环宽度
            // style:'#fff'            // 填充样式
        }
        let params = Object.assign(defaultOptions,options);
        let style = params.style && this.getGradient(params.style);

        this.ctx.beginPath();
        this.ctx.arc(0,0,params.radius,0,Math.PI*2,false);
        // 有独立样式
        if(style){
            if(params.type === 'fill'){
                this.ctx.fillStyle = style;
            }else{
                this.ctx.strokeStyle = style;
            }
        }
        if(params.type === 'fill'){
            this.ctx.fill();
        }else{
            this.ctx.lineWidth = params.width;
            this.ctx.stroke();
        }
        this.ctx.closePath();
        this.renderStyle(this.$style);
    }
    // 绘制文字
    drawText(options){
        let defaultOptions = {
            // style: '#000',  // 可传递颜色值，和渐变对象
            text: '文本',
            font:'18px Arial',
            type:'fill',
            leAlign:'center',     
            veAlign:'middle', 
            x:0,
            y:0,
        }
        // measureText() 检测文本所占宽度

        let params =  Object.assign(defaultOptions,options)
        let style = params.style && this.getGradient(params.style);

        this.ctx.font= params.font;

        if(params.leAlign) {
            this.ctx.textAlign = params.leAlign;
        }
        if(params.veAlign) {
            this.ctx.textBaseline  = params.veAlign;
        }
        // 有独立样式
        if(style){
            if(params.type === 'fill'){
                this.ctx.fillStyle = style;
            }else{
                this.ctx.strokeStyle = style;
            }
        }
        if(params.type === 'fill'){
            this.ctx.fillText(params.text, params.x, params.y);
        }else{
            this.ctx.strokeText(params.text, params.x, params.y);
        }
        this.renderStyle(this.$style);
    }
}
