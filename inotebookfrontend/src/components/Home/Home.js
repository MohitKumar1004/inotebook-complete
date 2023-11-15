import React from 'react'
import Notes from '../Notes/Notes'

export default function Home(props) {
  return (
    <div>
      <Notes showAlert={props.showAlert}/>
    </div>
  )
}
