import React,{useState,useEffect} from 'react'
import {View,Text,ImageBackground,Image,FlatList,Switch} from 'react-native'
import {select,option,green,lokc,check,cross,icon} from '../../assets'
import {
    responsiveHeight,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
  import LinearGradient from 'react-native-linear-gradient';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles'
import {get_subscription} from '../../redux/actions/getSubscription';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

function sub_packages(props) {

    const [subscription,setSubs ] =  useState([])
    const [subscriptionId,setSubId ] =  useState([])
    const isFocused = useIsFocused();
    
    useEffect(() => {
        let packge_id = props?.userData?.subscriptionDetail?.subscriptionId
        console.log("cureent subs id=======>",packge_id);
        setSubId(packge_id)
        get_all()
    }, [isFocused])

    async function get_all (){
        try {
            const res = await props.get_subscription();
            var subs = res?.data
            
            setSubs(subs)
          } catch (err) {
            setRefreshing(false);
    
            console.log(err);
          }
    }

    return (
        <LinearGradient
        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
        style={{flex:1}}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={()=> props.navigation.goBack()}>
                <Image
                    source={cross}
                    style={{width:16,height:16,margin:20}}
                />
            </TouchableOpacity>
            <Image
                    source={icon}
                    style={{width:165,height:54,alignSelf:'center'}}
                />
            <View style={{marginTop:responsiveHeight(4),width:'90%',alignSelf:'center'}}>
                <Text style={{fontSize:18,fontWeight:'700',color:'#ffffff',fontFamily:'Lato',alignSelf:'center'}} >Subscribe to 4Relax Premium</Text>
                
                <FlatList
                  style={{marginTop:responsiveHeight(6),marginBottom:responsiveHeight(3)}}
                //   horizontal={true}
                //   showsHorizontalScrollIndicator={false}
                  data={subscription}
                  renderItem={({ item, index }) =>
                    <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                        style={{width:'100%',height:84,borderRadius:10,marginTop:responsiveHeight(2)}}>
                            {subscriptionId === item._id?
                                <View style={styles.select_container}>
                                    <Image
                                        source={select}
                                        style={{width:9.99,height:11}}
                                    />
                                    <Text style={[styles.select,{color:'black'}]} >Selected</Text>
                                </View>
                            :
                            <View style={[styles.select_container,{backgroundColor:'transparent'}]} ></View>}
                            
                            <TouchableOpacity onPress={()=> item.subscriptionName === 'Free'?null: props.navigation.navigate('Payment',{payment:item}) } style={{flexDirection:'row'}} >
                                <View
                                    style={{marginLeft:responsiveWidth(2.5),width:'28%',justifyContent:'center'}}
                                >
                                    <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>{item.subscriptionName}</Text>
                                </View>
                                <View style={{justifyContent:'center',width:'45%'}}>
                                    {/* <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>10 Meditations</Text>
                                    <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>2 Stories</Text>
                                    <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>10 Sounds</Text> */}

                                </View>
                                {item.subscriptionAmount === '0'?
                                    null
                                :
                                    <View style={{justifyContent:'center',alignItems:'center',width:'25%'}} >
                                        <Text style={[styles.price,{color:'#ffff',fontSize:22}]}>{item.subscriptionAmount}$</Text>
                                        <TouchableOpacity style={{width:43,marginTop:responsiveHeight(0.8),height:15,borderRadius:5,backgroundColor:'white',}}>
                                            <Text style={styles.price}>Buy</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </TouchableOpacity>
                </LinearGradient>
                }
                />

                <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                        style={[styles.setting_btn,{marginTop:responsiveHeight(4),marginBottom:responsiveHeight(3)}]}
                        >
                    <TouchableOpacity onPress={()=> props.navigation.navigate('Activation')} >
                        <Text style={[styles.title,{fontSize:18}]} >I have an activation code</Text>
                    </TouchableOpacity>
                </LinearGradient>

               
            </View>
            </ScrollView>
        </LinearGradient>
    )
}
const mapStateToProps = state => {
    const {userData} = state.auth;
    return {
        userData,
      };
  };
  export default connect(mapStateToProps, {get_subscription})(sub_packages);