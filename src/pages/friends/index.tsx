import React from 'react'
import Layout from '@theme/Layout'

import FriendCard from './_components/FriendCard'
import { Friends, type Friend } from '@site/data/friend'

import styles from './styles.module.css'

const TITLE = '友情链接'

function FriendHeader() {
  return (
    <section className="margin-top--lg margin-bottom--lg text--center">
      <h1>{TITLE}</h1>

    </section>
  )
}

function FriendCards() {
  const friends = Friends
  return (
    <section className="margin-top--lg margin-bottom--lg">
      <div className="container">
        <ul className={styles.showcaseList}>
          {friends.map(friend => (
            <FriendCard key={friend.avatar} friend={friend} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function FriendLink(): JSX.Element {
  return (
    <Layout title={TITLE}>
      <main className="margin-vert--lg">
        <FriendHeader />
        <FriendCards />
      </main>
    </Layout>
  )
}

export default FriendLink
