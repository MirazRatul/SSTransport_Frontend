import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { container } from '../../constants/container'
import AppText from '../../components/AppText'

const Profile = () => {
  return (
    <SafeAreaView style={container}>
      <AppText>Profile</AppText>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
})