import {Service} from "typedi";
import { CreateUserDto, LoginUserDto } from '../dtos/UserDto';
import { UserRepository } from "../repositories/userRepositories";
import axios from 'axios';

@Service()

export class UserService{
    constructor(private userRepositoriy: UserRepository){}

        public async register(createUserDto:CreateUserDto) {
            if(createUserDto.password === createUserDto.check_password) {
                return this.userRepositoriy.create(createUserDto);
            }else {
                return ("nok");
            }
        }

        public async login(loginUserDto: LoginUserDto) {
            return await this.userRepositoriy.login(loginUserDto);
        }

        public async kakaoLogin(code:string) {
            const token = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params:{
                grant_type: 'authorization_code',
            client_id: process.env.KAKAO_REST_API_KEY,
            code,
            redirect_uri : process.env.KAKAO_REDIRECT_URI
            }
        })

        const kakaoUserInfo = await axios.post('https://kapi.kakao.com/v2/user/me',{},{
            headers: {
                "Content-Type" : "application/x-www-form-urlencoded;charset",
                "Authorization" : 'Bearer ' + token.data.access_token
            }
        })

        return kakaoUserInfo;
    }
    public async naverLogin(code:string) {
        const token = await axios.post(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_CLIENT_SECRET_KEY}&code=${code}&state=state`,{},{})
        
        const naverUserInfo = await axios.get('https://openapi.naver.com/v1/nid/me',{
            headers:{
                "Authorization" : `Bearer ${token.data.access_token}`
            }
        })
        return naverUserInfo;
    }
}