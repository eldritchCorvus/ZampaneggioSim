
import real_eye from './../../images/real_eye.png';

import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { Room } from './Room';
import { all_themes, Theme } from '../../Modules/Theme';
import { BUGS, DECAY, FEELING, LOVE, SMELL, SOUND, TASTE, TWISTING } from '../../Modules/ThemeStorage';
import styled from '@emotion/styled';
import help_icon from './../..//images/Walkabout/icons8-chat-64.png';
import x_icon from './../..//images/Walkabout/icons8-x-50.png';

import { HelpChatBox } from './HelpChatBox';
import { playHelpDeskMusic, playAmbientMazeMusicMadness, doorEffect } from '../..';
import SeededRandom from '../../Utils/SeededRandom';
import FlavorPopup from './FlavorPopup';


export const WalkAround = () => {

    const HelpIcon = styled.button`
    position: fixed;
    top: 15px;
    right: 15px;
    color: white;
    text-decoration: none;
    background-color: #1f3f87;
    border-radius: 25px;
    font-size: 28px;
    line-height: 33px;
    padding-left: 20px;
    padding-right: 20px;
    cursor: pointer;
`

    const RoomContainer = styled.div`
        padding: 10px;
        margin: 10px;
        font-weight: 500;
        box-shadow: 2px 2px 2px 3px rgba(0, 0, 0, .2);
        box-shadow: 2px 2px 2px 3px rgba(0, 0, 0, .2);
        margin-left: auto;
        margin-right: auto;
        position: fixed;
        overflow: auto;
        top: 5%;
        left: 25%;
    `;

    const IconImage = styled.img`
    height: 33px;
    width: 33px;
    `

    interface PlayerProps {
        leftSpawn: number;
        topSpawn: number;
    }
    

    const Player = styled.img`
        position: absolute;
        left: ${(props: PlayerProps) => props.leftSpawn}px;
        top: ${(props: PlayerProps) => props.topSpawn}px;
    `

    //number of themes/2 is how many doors to have.
    const [themeKeys,setThemeKeys] = useState<string[]>([all_themes[BUGS].key,all_themes[DECAY].key,all_themes[LOVE].key]);
    const [seededRandom] = useState(new SeededRandom(216));
    const [flavorText, setFlavorText] = useState<string|undefined>()
    const [chatHelp, setChatHelp] = useState(false);
    const [spawnPoint, setSpawnPoint] = useState({left:250,top:450});

    //useRef is liek state but for when you don't want to trigger a render.
    const playerLocationRef = useRef(spawnPoint);


    const distanceWithinRadius = (radius:number,x1:number,y1:number,x2:number,y2:number)=>{
        const first = (x1-x2)**2;
        const second = (y1-y2)**2;
        return (first + second)**0.5 < radius;
    }

    /*
        NOTE:

        seeded random here should be based on current 'global' seed plus whether you went north, south or east
        
        new rooms should have all the same rooms as the previous but
         remove one theme and replace it with another

        this creates "neighborhoods" of aesthetics, i'm betting
    */

    const childRoomThemes = (rand: SeededRandom)=>{
        const roll = seededRandom.nextDouble();
        if(roll>0.6){
            //add a theme, but don't go over 6
            if(themeKeys.length < 6){
                return [...themeKeys,rand.pickFrom(Object.values(all_themes)).key];

            }else{
                return [...themeKeys.slice(1),rand.pickFrom(Object.values(all_themes)).key];
            }

        }else if (roll > 0.3){
            //remove a theme, but don't go under one
            if(themeKeys.length > 1){
                return [...themeKeys.slice(1)];

            }else{
                return [...themeKeys.slice(1),rand.pickFrom(Object.values(all_themes)).key];
            }
        }else{
            //same amount just one different
            return [...themeKeys.slice(1),rand.pickFrom(Object.values(all_themes)).key];
        }
    }

    useEffect(()=>{
        const flavorChance = 1.0;
        if(seededRandom.nextDouble()<flavorChance){
            const chosen_theme = all_themes[seededRandom.pickFrom(themeKeys)];
            const senses = [SMELL,SOUND,SMELL,SOUND,SMELL,SOUND,FEELING,FEELING,FEELING,FEELING,TASTE];
            const sense = seededRandom.pickFrom(senses);
            let phrase = "";
            if(sense === SMELL){
                phrase = `The smell of ${chosen_theme.pickPossibilityFor(seededRandom, sense)} floods your nose.`;
            }else if(sense === SOUND){
                phrase = `The sound of ${chosen_theme.pickPossibilityFor(seededRandom, sense)} floods your ears.`;

            }else if(sense === FEELING){
                phrase = `Everything feels like ${chosen_theme.pickPossibilityFor(seededRandom, sense)}.`;

            }else if(sense ===TASTE){
                phrase = `Oh god, why can you taste ${chosen_theme.pickPossibilityFor(seededRandom, sense)}.`;

            }
            setFlavorText(phrase);
        }
    },[themeKeys])

    const goNorth = ()=>{
        //put you to the south
        setSpawnPoint({left: 250, top: 475-50});
        const tmpRand = new SeededRandom(0+seededRandom.getRandomNumberBetween(216,216216216216216));
        //spawn a new room
        setThemeKeys(childRoomThemes(tmpRand));
    }

    const goSouth = ()=>{
        //put you to the south
        setSpawnPoint({left: 250, top: 105+50});
        const tmpRand = new SeededRandom(1+seededRandom.getRandomNumberBetween(216,216216216216216));
        //spawn a new room
        setThemeKeys(childRoomThemes(tmpRand));
    }

    const goEast = ()=>{
        //put you to the south
        setSpawnPoint({left: 25+50, top: 250});
        const tmpRand = new SeededRandom(2+seededRandom.getRandomNumberBetween(216,216216216216216));
        //spawn a new room
        setThemeKeys(childRoomThemes(tmpRand));
    }

    useEffect(()=>{
        playerLocationRef.current =({top:spawnPoint.top, left:spawnPoint.left})
    }, [spawnPoint])

    const numberDoors=useMemo(()=>{
        return Math.ceil(themeKeys.length+1)/2;
    },[themeKeys]);

    //where is the player? are they near a door?
    const checkForDoor =(top: number, left: number)=>{
        //TODO check how many doors actually exist
        const SOUTH = [250,475];
        const NORTH = [250,105];
        const EAST = [475,250];

        const wanderer_radius = 25;
        let nearDoor = false;



        //there will ALWAYS be a door to the south at the very minimum
        if(distanceWithinRadius(wanderer_radius,SOUTH[0],SOUTH[1] ,left,top)){
            goSouth();
            nearDoor = true;
        }

        if(numberDoors > 1 && distanceWithinRadius(wanderer_radius,NORTH[0],NORTH[1] ,left,top)){
            nearDoor = true;
            goNorth();
        }

        if(numberDoors > 2 && distanceWithinRadius(wanderer_radius,EAST[0],EAST[1] ,left,top)){
            goEast();
            nearDoor = true;
        }


        if(nearDoor){
            doorEffect();
        }

    }
 

    const processWalk =(key:string)=>{
        const minTop = 500-350-30;
        const maxTop = 500-30;
        const maxLeft = 455;
        const minLeft =15;
        const p = playerRef.current;
        if(p){
            let prevTop = parseInt(p.style.top);
            if(!prevTop){
                prevTop =spawnPoint.top;
            }

            let prevLeft = parseInt(p.style.left);
            if(!prevLeft){
                prevLeft =spawnPoint.left;
            }

            if((key === "s" || key === "ArrowDown")&& prevTop < maxTop){
                p.style.top = `${prevTop+10}px`;
            }
            if((key === "w" || key === "ArrowUp")&& prevTop > minTop){
                p.style.top = `${prevTop-10}px`;
            }
            if((key === "a" || key === "ArrowLeft") && prevLeft > minLeft){
                p.style.left = `${prevLeft-10}px`;
            }
            if((key === "d" || key === "ArrowRight")&& prevLeft < maxLeft ){
                p.style.left = `${prevLeft+10}px`;
            }
            //because this changes state calling this used to rerender the room (which would rerandomize its appearance), memoizing numberDoors fixed this
            playerLocationRef.current=({top:parseInt(p.style.top), left: parseInt(p.style.top)})
            checkForDoor(prevTop, prevLeft);
        }
    }

    const handleUserKeyPress = (event: KeyboardEvent)=>{
        processWalk(event.key);
    }

    useEffect(() => {
        window.addEventListener('keypress', handleUserKeyPress);
    
        return () => {
          window.removeEventListener('keypress', handleUserKeyPress);
        };
      });

      const playerRef = useRef<HTMLImageElement>(null);

      useEffect(()=>{
          if(chatHelp){
            playHelpDeskMusic();
          }else{
            playAmbientMazeMusicMadness();
          }
      },[chatHelp])


    return (
        <Fragment>
            <RoomContainer>

            <Room themeKeys={themeKeys} numberDoors = {numberDoors} seededRandom={seededRandom}/>
            {flavorText ?<FlavorPopup text={flavorText} left={playerLocationRef.current.left} top={playerLocationRef.current.top}/>:null}
            <Player ref={playerRef}src={real_eye} id="player" leftSpawn={spawnPoint.left} topSpawn={spawnPoint.top}></Player>
            </RoomContainer>
            <div>TODO:

                FIVE MINUTE TODO.
                <li>when enter room, small chance of sensory flavor text from theme. (smell, sound, etc) centered on wanderer location</li>
                <li>flavor text vanishes after three seconds or when you hit enter</li>
                <li>front and back wall items for corruption (less "3d" so easeir to think about)</li>
                <li>front and back floor items for corruption</li>
                <li>spawn wall items (with text) from theme (both backgound and foreground (jail bars, curtains etc))</li>
                <li>spawn floor items (with text) from theme (both background (carpet, holes, etc) and foreground)</li>
                <li>if approach an item, flavor text</li>
                <li>spawn wall and floor vents rarely, with text</li>
                <li>spawn hydration stations</li>
                <li>spawn tape players (secret music)</li>
                <li>add audio logs to secret music</li>
                <li>pick a  effect for the room rarely (tint for many of them (red for fire, blue for ocean for example), completely opaque black for dark and obfuscations, spiral has weirdness, ocean and lonely has fog, stranger, dark etc, corruption has bugs overlaid)</li>
                <li>secret hax coffin to the left, credits</li>





                <li>endless dream inside the coffin</li>
                <li>EXTREMELY IMPORTANT: should use seeded random for generating new rooms so it can be mapped.</li>
                <li>text should get auto lower cased , shit post extensions like 217, 113, etc.  217 says "There's no one here. Leave."</li>
                <li>leads to infinite spiralling help desk that leverages attic code, plot is Wanda trying to accuse Eyedol of having a serial killer in their staff</li>
                <li>after ten minutes you reach the closer who actually listens to what you say, is in a new chat window entirely and wants to know what they need to do to make you go away.</li>
                <li>how should i detect i'm near a door so i can go into a new room?</li>
                <li>the room you are currently in generates child rooms that share at least one theme</li>
                <li>press enter to interact</li>
                <li>spawnable tape players (add more secret music, including things that are just audio logs from the closer)</li>

                <li>interact with door you go into new room</li>
                <li>new theme hash in ThemeStorage (can't just make new one cuz want senses and objects etc) has WalkObject. WalkObject has wall graphic, floor graphic, wall scattered graphics and floor scattered graphics objects with source and text. if any source is null, glitchy placeholder</li>
                <li>render floor, walls, and a few objects from themes</li>
                <li>when you interact with an object you get its flavor text (even if its glitchy) </li>
                <li>add glitch effect to WalkObject themes.</li>
                <li>Friends can show up. You can talk to them. You can use them to open doors. </li>
                <li>when all friends are dead NAM and ShamblingHorror show up</li>
                <li>rooms can rarely spawn music boxes or SCRIBBLED NOTEBOOKS which engage with random thematic content</li>
                <li>have way to get to credits in mod</li>
                <li>find your coffin and go down and down and down</li>
                <li>put this on LItRpgsim never tell anyone (also itch.io and steam) (diff base themes corruption steam)</li>
            </div>
            <HelpIcon onClick={()=>setChatHelp(!chatHelp)}><div style={{display:"inline-block", verticalAlign: "top",textAlign: "center"}}>Help</div>{chatHelp?<IconImage src ={x_icon}></IconImage>:<IconImage src ={help_icon}></IconImage>}</HelpIcon>
            {chatHelp? <HelpChatBox/>:null}
        </Fragment>

    )
}