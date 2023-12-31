const express = require ('express');
const app = express();

const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient; 
app.set('view engine', 'ejs');
app.use('/public',express.static('public'));
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

 var db;

MongoClient.connect('mongodb+srv://fate300000:JEy33783808@cluster0.mqbkngy.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
    if(에러)return console.log(에러)

    db = client.db('todoapp');
    app.db = db;
    // db.collection('post').insertOne({이름:'John', 나이:20}, function(에러,결과){

    //     console.log('저장완료');

    // });
    // db.collection('post').insertOne('저장할데이터', function(에러,결과){

    //     console.log('저장완료');

    // });

    http.listen(8080,function(){
        console.log('listening on 8080')        
    });
    
}) 

app.get('/socket',function(요청,응답){
    응답.render('socket.ejs')
})

io.on('connection',function(socket){
    console.log('유저접속됨')

    socket.on('user-send',function(data){
        console.log(data);
    })

})

app.get('/write',function(요청,응답){
    응답.render('write.ejs')
})

app.get('/',function(요청,응답){
    응답.render('index.ejs')
})


app.get('/edit/:id',function(요청,응답){
    db.collection('post').findOne({_id: parseInt(요청.params.id)}, function(에러,결과){
        console.log(결과)
        응답.render('edit.ejs',{post:결과})
    })
   
})


app.put('/edit', function(요청,응답){
//폼에 담긴 할일데이터, 날짜데이터를 가지고 db.collection 에다가 업데이트함 
db.collection('post').updateOne({_id : parseInt(요청.body.id)},{$set:{할일:요청.body.title, 날짜:요청.body.date}},function(에러,결과){
    console.log('수정완료')
    응답.redirect('/list')
})

});




// 누군가가 /pet으로 방문하면 pet 관련된 안내문을 띄워주자



    app.get('/eng',function(요청, 응답){
        응답.send('영어공부하는 페이지입니다');
        
        });   

    
// app.get('/write',function(요청, 응답){
//         응답.sendFile(__dirname+'/write.html');
        
//         });



// 어떤 사람이 /add 경로로 POST 요청을 하면 ???를 해주세요
//app.post('경로',콜백함수) 
//요청에 입력받은 내용 저장됨
//꺼내서 쓰려면 body.parser라는 library가 필요함  



//list에 get 요청으로 접속사면 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
//디비에 저장된 post라는 collection안의 제목이 모든 데이터를 꺼내주세요. 

app.get('/list', function(요청,응답){
    db.collection('post').find().toArray(function(에러,결과){
        console.log(결과);
        응답.render('list.ejs',{posts:결과});
    });
});


app.get('/search', (요청,응답)=>{
    var 검색조건 = [
        {
          $search: {
            index: 'titleSearch',
            text: {
              query: 요청.query.value,
              path: '할일'  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
            }
          }
        },
        //id로 정렬하기 
        {$sort: {_id:1 }},
        //5개 까지만 가져오기 
        {$limit:5}
    ] 
    console.log(요청.query.value);
db.collection('post').aggregate(검색조건).toArray((에러,결과)=>{
console.log(결과)
응답.render('search.ejs',{posts:결과});
})
})




const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require ('express-session');

app.use(session({secret:'비밀코드', resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function(요청,응답){
    응답.render('login.ejs');
});

app.post('/login', passport.authenticate('local',{
    failureRedirect:'/fail'
}), function(요청,응답){
    응답.redirect('/');
});

app.get('/mypag',로그인했니 ,function(요청,응답){
console.log(요청.user);
    응답.render('mypage.ejs',{사용자: 요청.user})

});


let multer = require ('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/image')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

var upload = multer({storage:storage });


app.get('/upload',function(요청,응답){
    응답.render('upload.ejs')
})

app.post('/upload', upload.single('profile'), function(요청,응답){

    응답.send('업로드완료')
} );

app.get('/image/:imageName', function(요청,응답){
 응답.sendFile(__dirname+'/public/image'+ 요청.params.imageName)

})





function 로그인했니(요청,응답,next){

if(요청.user){
    next()
}else{
응답.send('로그인 안하셨는데요?')
}
}




passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      if (에러) return done(에러)
  
      if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
      if (입력한비번 == 결과.pw) {
        return done(null, 결과)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));

passport.serializeUser(function(user,done){
done(null,user.id)

}); 
passport.deserializeUser(function(아이디,done){
    //디비에서 위에있는 user.id로 유저를 찾은 뒤에 유저 정보를 아래에 넣음 
    db.collection('login').findOne({id:아이디},function(에러,결과){
    done(null,결과)
    })
});

app.post('/register',function(요청,응답){

db.collection('login').insertOne({id:요청.body.id, pw:요청.body.pw},function(에러,결과){

응답.redirect('/')

})

})



app.post('/chatroom', function(요청, 응답){
    // // 값의 존재 여부 확인 gpt가 만들어 준 것 
    if (!요청.body.당한사람id || 요청.body.당한사람id.length !== 24) {
        return 응답.status(400).send("Invalid ID format");
    }

    var 저장할거 = {
      title : '무슨무슨채팅방',
      member : [요청.body.당한사람id, 요청.user._id],
      date : new Date()
    }

    db.collection('chatroom').insertOne(저장할거).then((결과)=>{
      응답.send('성공')
    });
});


app.get('/chat',로그인했니,function(요청,응답){
db.collection('chatroom').find( {member : 요청.user._id}).toArray().then((결과)=>{
  응답.render('chat.ejs', {data:결과})
})
});

app.post('/message',로그인했니,function(요청,응답){
   
   var 저장할거 ={
    parent:요청.body.parent ,
    content:요청.body.content ,
    userid: 요청.user._id,
    date: new Date(),
   }
   

    db.collection('message').insertOne(저장할거).then(()=>{
        console.log('DB저장성공');
        응답.send('DB저장성공')
    }).catch(()=>{
        console.log('DB저장실패')
    })
    });
    

app.get('/message/:id',로그인했니,function(요청,응답){
응답.writeHead(200,{
"Connection":"keep-alive",
"Content-Type":"text/event-stream",
"Cache-Control":"no-cache",
});

db.collection('message').find({parent:요청.params.id}).toArray().then((결과)=>

{
응답.write('event:test\n');
응답.write('data:'+JSON.stringify(결과)+'\n\n');
})
const 찾을문서 = [
    { $match: { 'fullDocument.parent':요청.params.id } }
];
  
const changeStream = db.collection('message').watch(찾을문서);

changeStream.on('change', (result) => {
    응답.write('event:test\n');
    응답.write('data:'+JSON.stringify([result.fullDocument])+'\n\n');
});




});




app.post('/add',function(요청,응답){
   


    응답.send('전송완료');
    // console.log(요청.body.title);
    // console.log(요청.body.date);
    //DB에 저장해주세요. 
    //총게시물 갯수 -> auto increment
    db.collection('counter').findOne({name:'게시물갯수'},function(에러,결과){
        // console.log(결과.totalPost);
        if(!결과) {
            return console.log("게시물갯수 문서가 존재하지 않습니다.");
        }
        var 총게시물갯수=결과.totalPost;
        var 저장할거 = {_id:총게시물갯수+1 , 할일:요청.body.title, 날짜:요청.body.date, 작성자: 요청.user._id}


        db.collection('post').insertOne(저장할거, function(에러,결과){
         console.log('저장완료');
    //counter라는 콜렉션에 있는 totalPost라는 항목도 1 증가 시켜야함;         
    //db.collection('counter')(db중에 counter를 찾아서).updateOne({name:'게시물갯수'(이런걸 찾아서)},{$inc:{totalPost:1}}(이렇게 설정함)
    //{$set:{totalPost:바꿀 값}}, {$inc:{totalPost:기존에 더해줄 값}}
        db.collection('counter').updateOne({name:'게시물갯수'},{$inc:{totalPost:1}},function(에러,결과){

            if(에러){return console.log(에러)}

        })

        });
    });
}); 


app.delete('/delete',function(요청,응답){

    console.log(요청.body);
    
    요청.body._id = parseInt(요청.body._id);
    //요청.body에 담긴 게시물 번호에 따라 DB에서 게시물 삭제
    
    var 삭제할데이터 = {_id:요청.body._id,작성자: 요청.user._id}
    
    db.collection('post').deleteOne(삭제할데이터,function(에러,결과){
    
        console.log('삭제완료');
    
        if(결과){console.log(결과)}

        응답.status(200).send({message:'성공했습니다'});
    
    })
    })


//detail로 접속하면 detail.ejs 보여줌 
//'/detail/:id'이런식으로 하면 페이지를 계속 만들어낼 필요는 없음 


app.get('/detail/:id',function(요청,응답){
    db.collection('post').findOne({_id: parseInt(요청.params.id)},function(에러,결과){
        console.log(결과);
        응답.render('detail.ejs',{ data : 결과});
    })
})

app.use('/shop', require('./routes/shop.js'));
app.use('/board/sub', require('./routes/board.js'));



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