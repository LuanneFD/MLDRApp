import {useState} from 'react';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { HStack, VStack } from 'native-base';

export function Home() {
const [groupSelected, setGroupSelected] =  useState('sobremesa')

    return (
        <VStack flex={1}>
           <HomeHeader />
           <HStack>
           <Group name="sobremesa" isActive={groupSelected === 'sobremesa'} onPress={() => setGroupSelected("sobremesa")}/>
           <Group name="massa" isActive={groupSelected === 'massa'} onPress={() => setGroupSelected("massa")}/>
           </HStack>
        </VStack>
    );
}