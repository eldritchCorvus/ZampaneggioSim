import { Player } from "../Modules/Player";
import { StatusHeader, StatusRow, StatusBlock, StatusContent } from "./Styles";
import { Input } from "reakit/Input";
import React, { Fragment, useState } from "react";
import styled from "@emotion/styled";
interface StatusProps {
    player: Player;
    loadScreen: any; //function
}
//TODO secret where you can access a weird procedural "city view" (ascii? svg? divs? canvas?) and explore it and clicking each building prints out procedural text
export const CityBuildingScreen = (props: StatusProps) => {

    const BuildingLine = styled.div`
    padding: 20px;
    font-size: 15px;
    width: 95%;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid black;
`
    const BuildingHeader = styled.div`
        display: inline-block;
        margin-right: 5px;
        width: 175px;
        font-weight: bolder;
        font-size: 18px;

    `
    const BuildingSection = styled.div`
        display: inline-block;
        margin-right: 5px;
        width: 175px;
    `

    const observer = props.player.observer;

    const [currentName, setCurrentName] = useState(observer.cityName);

    const setCityName = (ev: React.ChangeEvent<HTMLInputElement>) => {
        observer.cityName = ev.target.value;
        setCurrentName(ev.target.value);
    }

    return (
        <StatusBlock>
            <h1>{currentName}: TODO weird hidden map based on BuildingMetaData</h1>
            <StatusRow>
                <StatusHeader>Change City Name:</StatusHeader>
                <StatusContent><Input onChange={(ev) => { setCityName(ev) }} placeholder="Type Here"></Input></StatusContent>
            </StatusRow>
            <StatusRow>
                <StatusHeader>City Morale:</StatusHeader>
                <StatusContent>{observer.cityMorale}</StatusContent>
            </StatusRow>
            <StatusRow onClick={()=>{console.log("What if ThisIsAGame is what the DOM element said???")}}><span style={{display:"none"}}>What if ThisIsAGame tho???</span> </StatusRow>


            {observer.cityBuildingMenuLevel > 1 || props.player.order || props.player.chaos ? (
                <Fragment>
                    <div>
                        {props.player.buildings.map((building)=>{
                            return (
                            <BuildingLine>
                                <BuildingHeader>{building}: </BuildingHeader>
                                <BuildingSection>Status: Unbuilt </BuildingSection>
                                {observer.cityBuildingMenuLevel > 2 || props.player.order || props.player.chaos ?<BuildingSection>Assigned Leader: None </BuildingSection>:null}
                                {observer.cityBuildingMenuLevel > 2 || props.player.order || props.player.chaos ?<BuildingSection>Morale Boost: 0 </BuildingSection>:null}
                                {observer.cityBuildingMenuLevel > 2 || props.player.order || props.player.chaos ?<BuildingSection>Build Points: 0 </BuildingSection>:null}
                                {observer.cityBuildingMenuLevel > 2 || props.player.order || props.player.chaos ?<BuildingSection>Locked?: {props.player.buildingMetaData[building].unlocked?"":"🔒"} </BuildingSection>:null}

                            </BuildingLine>)
                    })}
                    </div>
                </Fragment>
            ) : null}

        </StatusBlock>);
}