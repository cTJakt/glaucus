import {GET_IMAGE_FOLDERS,GET_IMAGE_CLASSES,GET_IMAGES,CHANGE_FOLDER,CHANGE_CLASS,CHANGE_MODAL_STATE,UPDATE_IMAGE_CLASS,INIT_IMAGE_PAGE,
        CHANGE_PAGE_INDEX,CHANGE_CLASS_SPIN,CHANGE_SELECT_IMAGE,CHANGE_LIST_PAGE} from '../actions/DLImageActions'
/**
 * Created by LXY on 2017/6/5.
 */
const initialState={
    imageFolders:[],        //所有的图片文件夹
    imageClass:[],          //文件夹下图片的类别
    images:[],              //某个类别下的所有图片文件
    selectFolder:"",       //选中的文件夹
    selectClass:"",        //选中的类别
    selectImage:"",        //选中的图片
    pageIndex:1,            //记录处于第几级界面，1处于文件夹的类别界面，2，处于每个类别的图片界面
    menuPage:1,             //记录当前menu的页数
    modalState:false,      //记录图片显示的 弹出框的状态
    changedClass:"",        //记录要更改的目标类别
    classSpinState:false,      //class界面的加载状态
};

export default (state = initialState, action) => {
    switch (action.type){
        case GET_IMAGE_FOLDERS:
            return Object.assign({},state,{
                imageFolders:action.imageFolders
            });
        case GET_IMAGE_CLASSES:
            return Object.assign({},state,{
                imageClass:action.imageClass
            });
        case GET_IMAGES:
            return Object.assign({},state,{
                images:action.images,
                classSpinState:false
            });
        case CHANGE_FOLDER:
            return Object.assign({},state,{
                selectFolder:action.selectFolder
            });
        case CHANGE_CLASS:
            return Object.assign({},state,{
                selectClass:action.selectClass
            });
        case CHANGE_MODAL_STATE:
            return Object.assign({},state,{
                modalState:action.modalState
            });
        case UPDATE_IMAGE_CLASS:
            return Object.assign({},state,{
                changedClass:action.changedClass
            });
        case INIT_IMAGE_PAGE:
            return Object.assign({},state,{
                imageFolders:action.imageFolders,        //所有的图片文件夹
                imageClass:action.imageClass,
                selectFolder:action.selectFolder
            });
        case CHANGE_PAGE_INDEX:
            return Object.assign({},state,{
                pageIndex:action.pageIndex
            });
        case CHANGE_CLASS_SPIN:
            return Object.assign({},state,{
                classSpinState:action.classSpinState
            });
        case CHANGE_SELECT_IMAGE:
            return Object.assign({},state,{
                selectImage:action.selectImage
            });
        case CHANGE_LIST_PAGE:
            return Object.assign({},state,{
                menuPage:action.menuPage
            });
        default:
            return state;
    }
}