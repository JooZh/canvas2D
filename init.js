// 画布尺寸
function init(){
    let width = 550;
    let height = 460;

    // 默认执行一次
    initDefaultCanvas();
    initRunCanvas(700,1);

    let oScore = document.querySelector('#score');
    let oSpeed = document.querySelector('#speed');
    let oRun = document.querySelector('#run');

    oRun.onclick = ()=>{
        let score = Number(oScore.value);
        let speed = Number(oSpeed.value);
        if(score){
            initRunCanvas(score,1);
        }
        if(score && speed){
            initRunCanvas(score,speed);
        }
    }

    // 绘制静态元素
    function initDefaultCanvas(){
        // 获取画布中心位置
        let x = width / 2;
        let y = height / 2;

        // 获取画布
        let canvas=document.getElementById('clock');
        let ctx =canvas.getContext('2d');

        // 缩放为2被配合 zoom 使显示更清晰
        ctx.scale(2,2);

        // 文字样式设置
        ctx.fillStyle='#fff';
        ctx.textAlign='center';
        ctx.textBaseline='bottom';

        // 绘制外环
        ctx.beginPath();
        ctx.arc(x,y,180,0,Math.PI*2,false);
        let ring = ctx.createLinearGradient(275,300,275,0);
        ring.addColorStop("0",'rgba(255,255,255,0)');
        ring.addColorStop("1",'rgba(255,255,255,0.5)');
        ctx.strokeStyle= ring;
        ctx.lineWidth='2';
        ctx.stroke();
        ctx.closePath();

        // 绘制内环
        ctx.beginPath();
        ctx.arc(x,y,150,60/180*Math.PI,120/180*Math.PI,true);
        ctx.strokeStyle='rgba(255,255,255,0.5)';
        ctx.lineWidth='15';
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();
        
        // 需要移动画布到中心
        ctx.translate(x,y);

        // 绘制左侧渐变矩形
        let ringL = ctx.createLinearGradient(-100,30,-70,30);
        ringL.addColorStop("0",'rgba(255,255,255,0)');
        ringL.addColorStop("1",'rgba(255,255,255,1)');
        ctx.fillStyle = ringL;
        ctx.fillRect (-100, 30, 30, 2);

        // 绘制右侧渐变矩形
        let ringR = ctx.createLinearGradient(98,30,68,30);
        ringR.addColorStop("0",'rgba(255,255,255,0)');
        ringR.addColorStop("1",'rgba(255,255,255,1)');
        ctx.fillStyle = ringR;
        ctx.fillRect (68, 30, 30, 2);

        // 绘制数字区间段
        let total=[300,550,600,700,800];
        ctx.fillStyle='rgba(255,255,255,0.7)';
        ctx.font='16px Arial';
        ctx.fillText(total[0],-115,8);
        ctx.fillText(total[1],-78,-76);
        ctx.fillText(total[2],0,-115);
        ctx.fillText(total[3],78,-76);
        ctx.fillText(total[4],115,8);
        
        // 获取当前日期
        let date=new Date();
        let ymd=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        ctx.font='20px Arial';
        ctx.fillText('评估时间 : '+ymd,0,80);
    }
    // 初始化动画
    function initRunCanvas(score,speed){
        let x = width / 2;
        let y = height / 2;

        // 绘制动画需要重置幕布，所以重建一个canvas对象
        let pointer=document.getElementById('pointer');
        let ctx=pointer.getContext('2d');

        // 缩放为2被配合 zoom 使显示更清晰
        ctx.scale(2,2);

        // 移动坐标到中心 设置全局文字样式 和默认样式
        ctx.translate(x,y);
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font='bold 78px Arial';
        ctx.fillText(0,0,-10);
        ctx.font='28px Arial';
        ctx.fillText('正在查询',0,40);

        // 获取数据
        // sendApiRequest('getScore').then(({data})=>{
        //     run(data.score)
        // })
        run(score)
        // 数字跳动
        function run(score=697,speed=1){
            // 初始化全局变量
            let timer;
            let i = 0;            // 转盘计数器
            let evluate = '';     // 当前评估状态

            // 设置最终的值
            let radian = 0;        // 计数器最大值 初始化
            let cumsum = 0         // 分数累加值 初始化

            // 根据值的大小确定应该到达的位置 这里的值得手动计算
            if(score <= 300){
                radian = score * 0.185;
            }else if(score > 300 && score <= 550){
                radian = score * 0.183;
            }else if(score > 550 && score <= 600){
                radian = (score-400) * 0.729;
            }else if(score > 600 && score <= 700){
                radian = (score-200) * 0.3815;
            }else if(score > 700 && score <= 800){
                radian = (score-200) * 0.392;
            }else{
                radian = (score-200) * 0.400;
            }

            // 计算出分数累加值
            cumsum = score / radian;
            
            // 区间显示文字
            if(score < 550){
                evluate = '不合格'
            }else if(score < 600){
                evluate = '信用一般';
            }else if(score < 700){
                evluate = '信用良好';
            }else if(score < 800){
                evluate = '信用优秀';
            }else{
                evluate = '信用极好';
            }

            // 所有的动画事件
            function slideValue(){
                // 每次渲染清空画布
                ctx.translate(-x,-y);
                ctx.clearRect(0,0,pointer.width,pointer.height);
                ctx.translate(x,y);
                
                // 累加器
                i++;

                // 绘制滚动元素
                ctx.beginPath();
                ctx.arc(0,0,150,120/180*Math.PI,(120+i)/180*Math.PI,false);
                ctx.strokeStyle ='rgba(255,255,255,1)';
                ctx.lineWidth ='20';
                ctx.lineCap = 'round';
                ctx.stroke();
                ctx.closePath();

                // 绘制刻度 
                for(let i=0;i<8;i++){
                    ctx.beginPath();
                    ctx.lineWidth='1';
                    ctx.strokeStyle= i===4 || i===3 || i===5 ? 'rgba(0,0,0,0)':'rgba(248,70,62,0.5)';
                    ctx.moveTo(142*Math.sin(45*i/180*Math.PI),-142*Math.cos(45*i/180*Math.PI));
                    ctx.lineTo(157*Math.sin(45*i/180*Math.PI),-157*Math.cos(45*i/180*Math.PI));
                    ctx.stroke();
                    ctx.closePath();
                }
                
                // 填充分数
                ctx.font='bold 78px Arial';
                let showScore = i * cumsum;
                showScore = showScore >= score ? score : showScore;
                ctx.fillText(parseInt(showScore,10),0,-10);
                
                // 填充 查询结果 如果到达所需要的弧度，则停止，否则继续跳动
                ctx.font='28px Arial';
                let timeOver = showScore / score * 15 * speed;
                if(i > radian){
                    setTimeout(()=>{
                        ctx.fillText(evluate,0,40);
                    },100);
                    clearTimeout(timer);
                }else{
                    ctx.fillText('正在查询',0,40);
                    timer=setTimeout(slideValue,timeOver);
                }
                console.log('i:',i,'showScore:',showScore,'radian:',radian,'cumsum:',cumsum)
            }
            slideValue();
        }
    }        
}
