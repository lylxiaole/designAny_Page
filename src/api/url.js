const uri_alarm = "http://118.31.184.21:7800";

const alarmUrls = {
    //模板
    Template: {
        List: uri_alarm + "/api/Templates/Paging", //获取模板
        Add:uri_alarm + "/api/Templates", // 添加模板
        Update: uri_alarm +"/api/Templates",//编辑模板
        Detail: uri_alarm + "/api/Templates", //模板明细
        Delete: uri_alarm + "/api/Templates/DeleteTemplate", //删除模板
        BindChannelList: uri_alarm + "/api/Templates/{Templated}/Channels/Type/{ChannelType}", //已绑定渠道列表
        LeaveChannelList:uri_alarm+ "/api/Templates/{Templated}/LeaveChannels/Type/{ChannelType}",//未绑定渠道列表
        AddChannels: uri_alarm + "/api/Templates/AddChannels", //绑定渠道
        DeleteChannels:uri_alarm+"/api/Templates/DeleteChannels",//删除绑定渠道
    },
    //渠道
    Channel:{
        List: uri_alarm + "/api/Channels/Type/{ChannelType}/Paging", //获取渠道
        Add: uri_alarm + "/api/Channels", //添加渠道
        Update: uri_alarm + "/api/Channels", //更新渠道
        Detail: uri_alarm + "/api/Channels", //渠道明细
        Delete: uri_alarm + "/api/Channels",//删除渠道
    },
    //消息
    Logs:{
        List: uri_alarm + "/api/Logs/Paging",//获取消息日志
        Detail: uri_alarm + "/api/Logs/{LogId}/Details", //渠道明细
    },
    //枚举类
    Enums:{
        SceneType: uri_alarm + '/api/Enums/SceneType',//场景类型
        MessageState:uri_alarm + '/api/Enums/MessageState'//消息状态
    }
}

export { alarmUrls };