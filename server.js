const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

app.listen(8080,function(){
    console.log('listening on 8080')        
});

// 누군가가 /pet으로 방문하면 pet 관련된 안내문을 띄워주자

app.get('/pet',function(요청, 응답){
응답.send('펫용품을 쇼핑할 수 있는 페이지입니다');

});

app.get('/beauty',function(요청, 응답){
    응답.send('미용 용품을 쇼핑할 수 있는 페이지입니다');
    
    });

    app.get('/eng',function(요청, 응답){
        응답.send('영어공부하는 페이지입니다');
        
        });   

app.get('/',function(요청, 응답){
        응답.sendFile(__dirname+'/index.html');
        
    });
    
app.get('/write',function(요청, 응답){
        응답.sendFile(__dirname+'/write.html');
        
        });
// 어떤 사람이 /add 경로로 POST 요청을 하면 ???를 해주세요
//app.post('경로',콜백함수) 
//요청에 입력받은 내용 저장됨
//꺼내서 쓰려면 body.parser라는 library가 필요함  

app.post('/add',function(요청,응답){
    응답.send('전송완료')
    console.log(요청.body.title);
    console.log(요청.body.date);
    //DB에 저장해주세요. 
});

//REST 원칙 6개 1.Uniform interface 2.Client-Server 역할구분 3.Stateless(요청1과 요청2는 의존성이 없어야함)
//4.Cacheable(서버에서 보내주는 정보들을 캐싱이 가능해야함) 5.Layered System 6.Code on Demand 