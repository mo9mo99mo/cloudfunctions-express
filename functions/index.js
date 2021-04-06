const functions = require("firebase-functions");
// Expressの読込
const express = require("express");
// モジュール読込
const requestPromise = require("request-promise-native");
const cors = require("cors");

//local
// http://localhost:5000/functions-ee935/us-central1/helloWorld

//deploy
//https://us-central1-functions-ee935.cloudfunctions.net/helloWorld

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const app = express();

//ファイル内全てにapiアクセスを許可
//app.use(cors());

const getDataFromApi = async (keyword) => {
    // requestPromise関数
    // cloud functionsから実行する場合には地域の設定が必要`country=JP`を追加
    const requestUrl =
        "https://www.googleapis.com/books/v1/volumes?country=JP&q=intitle:";
    const result = await requestPromise(`${requestUrl}${keyword}`);
    return result;
};

//getでリクエストを受ける /helloで受けて req第1引数レスポンス
app.get("/hello", (req, res) => {
    // レスポンスを返す
    res.send("Hello Express!");
});

// エンドポイント追加
//パラメータ受け取る時は:の後につける
app.get("/user/:userId", (req, res) => {
    const users = [
        { id: 1, name: "ジョナサン" },
        { id: 2, name: "ジョセフ" },
        { id: 3, name: "承太郎" },
        { id: 4, name: "仗助" },
        { id: 5, name: "ジョルノ" },
    ];
    //targetのユーザーを取得
    // req.params.userIdでURLの後ろにつけた値を取得 find関数
    const targetUser = users.find(
        (user) => user.id === Number(req.params.userId)
        //文字列で取得されるのでNumber関数で数値に変換すること！
    );
    res.send(targetUser);
});

// エンドポイント追加
//非同期処理でasync、awaitを使用
// 特定のAPI（googlebooksAPI）のCORS を許可`cors()`を第2引数に追加
app.get("/gbooks/:keyword", cors(), async (req, res) => {
    // APIリクエストの関数を実行
    const response = await getDataFromApi(req.params.keyword);
    res.send(response);
});


//デプロイ
const api = functions.https.onRequest(app);
module.exports = { api };

// exports.helloWorld = functions.https.onRequest((request, response) => {
//     functions.logger.info("Hello logs!", { structuredData: true });
//     response.send("Hello from Firebase!");
// });
