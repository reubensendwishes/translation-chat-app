a.panel過渡

UserA在載入網頁時

{
recipient:UserA,
status:'pending'
}
好友邀請通知列表

{
recipient:UserA,
status:'accepted'
},
{
requester:UserA,
status:'accepted'
}
好友清單

{
recipient:UserA,
status:'accepted'
},
{
requester:UserA,
status:'accepted'
}
在UserB的頁面顯示已經送出好友邀請

{
requester:UserA,
recipient:UserB,
status:'pending'
}
在UserB的頁面顯示已經送出好友邀請

對方提出邀請或是雙方都沒提出邀請
在UserB頁面顯示可以加好友

再來的邏輯是寄給對方

還沒有取消現有好友的邏輯
