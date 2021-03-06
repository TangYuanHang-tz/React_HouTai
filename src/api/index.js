

import ajax from "./ajax"
// 引入jsonp库,用于发送jsonp请求
import jsonp from 'jsonp'
import {message} from 'antd'

// const BASE = "http://localhost:5000",因为请求的是5000端口，但是浏览器是在3000端口发请求，ajax存在跨域
//所以在package.json中配置代理服务器"proxy": "http://localhost:5000"
const BASE = ''
//因为是空串，所以在ajax方法中，BASE其实就是当前浏览器的地址，所以请求的发送方和接收请求的服务器在同一域中
//但是代理服务器会将我么发送的请求转发到5000端口，但是这是服务器跨域，是不会被阻止的，只有浏览器ajax请求跨域，才会被浏览器阻止

//1.登录
/* export function reqLogin(username,password){
    return ajax(BASE+'/login',{username:username,password:password},'POST')
} */

export const reqLogin = (username,password) => ajax(BASE+'/login',{username:username,password:password},'POST')

//2.添加用户,要求传递过来的参数user必须是一个符合接口规则的user对象
export const reqAddUser = (user) => ajax(BASE+"/manage/user/add",user,'POST')

//3.获取商品分类（包含一级分类/二级分类）
export const reqCategorys = (parentId) => ajax(BASE+"/manage/category/list",{parentId})

//4.更新分类名称
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST')

//5.添加分类名称
export const reqAddCategory = (parentId,categoryName) => ajax(BASE+'/manage/category/add',{parentId,categoryName},'POST')

// 6.获取商品分页列表
export const reqProducts = ({pageNum,pageSize}) => ajax(BASE+"/manage/product/list",{pageNum,pageSize})

//7.根据商品名称或者商品描述来获取商品分页列表
export const reqSearchProducts = ({
    pageNum,
    pageSize,
    searchType, //该属性的值只能为productName或者productDesc，用来判断根据商品名称还是商品描述来获取商品分页列表
    searchName  //查询的商品名称或商品描述值
}) => ajax(BASE+'/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
})

// 8.对商品进行上架/下架处理
export const reqUpdateStatus =  (productId,status) => ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')

// 9.根据分类ID获取分类
export const reqCategory = (categoryId) => ajax(BASE+'/manage/category/info',{categoryId})

// 10.删除图片
export const reqDelteImg = (name) => ajax(BASE+'/manage/img/delete',{name},'POST')

// 11.添加或者修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE+'/manage/product/'+(product._id ? 'update' : 'add'),product,'POST')

//12. 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')

//13. 获取角色列表
export const reqRoles = () => ajax('/manage/role/list')

//14. 更新角色(给角色设置权限)
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

//15. 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')

//16. 获取用户列表
export const reqUsers = () => ajax('/manage/user/list')

//17. 删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', {userId}, 'POST')








/*测试 
reqLogin('admin','admin').then((result)=>{
    console.log('result',result);
}) */

// ---------暴露：一个发送jsonp请求的方法（用于请求百度的接口用于获取天气图片以及天气状态,需要引入jsonp库）
export const reqWeather = (location) => {
    //确定请求的接口路径，但是天气地址需要手动传入
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${location}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2` 

    //--------我们应该确定执行异步请求后返回的是一个promise对象，所以我们返回一个new的promise对象,将jsonp请求方法放入Promise的执行函数
    //内部，因为在那里执行异步操作。同时jsnop请求其实是通过<script>标签发送标签，所以是同步的，所以我们最好使用一个定时器将整个jsnop请求
    // 括起来，使其成为一个异步的请求。注意：因为我们返回的是Promise对象，所以当jsonp请求成功并且获取到成功数据的时候，我么需要将指定promise
    // 对象为成功对象，并且数据为jsnop请求返回的数据
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            //调用jsonp请求方法，需要引入jsonp库
            jsonp(url,{},(error,data)=>{
                // 判断jsnop请求是否成功
                if(!error && data.status === 'success'){
                    //成功，获取所需要的天气数据
                    const {dayPictureUrl,weather} = data.results[0].weather_data[0]
                    //指定Promise成功状态，指定成功数据
                    resolve({dayPictureUrl,weather})
                }else{
                    //失败，调用antD中的message组件，提示错误
                    message.error("获取天气信息失败！")
                }
            })
        },0)
    })
    
}