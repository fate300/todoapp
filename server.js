const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient; 
app.set('view engine', 'ejs');

var db;

MongoClient.connect('mongodb+srv://fate300000:JEy33783808@cluster0.mqbkngy.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
    if(에러)return console.log(에러)

    db = client.db('todoapp');
    db.collection('post').insertOne({이름:'John', 나이:20}, function(에러,결과){

        console.log('저장완료');

    });
    // db.collection('post').insertOne('저장할데이터', function(에러,결과){

    //     console.log('저장완료');

    // });

    app.listen(8080,function(){
        console.log('listening on 8080')        
    });
    
}) 








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
    db.collection('post').insertOne({할일:요청.body.title, 날짜:요청.body.date}, function(에러,결과){

        console.log('저장완료');

    });

}); 


//list에 get 요청으로 접속사면 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
app.get('/list', function(요청,응답){
    응답.render('list.ejs')
});



// app.post('/add',function(요청,응답){
//     응답.send('전송완료')
//     console.log(요청.body.title);
//     console.log(요청.body.date);
//     //DB에 저장해주세요. 
// });


//어떤 사람이 /add 라는 경로로 post 요청을 하면, 데이터 2개(날짜,제목)를 보내주는데, 이 때, 'post' 라는 이름을 가진 
//Collection에 두개 데이터를 저장하기




//REST 원칙 6개 1.Uniform interface 2.Client-Server 역할구분 3.Stateless(요청1과 요청2는 의존성이 없어야함)
//4.Cacheable(서버에서 보내주는 정보들을 캐싱이 가능해야함) 5.Layered System 6.Code on Demand 