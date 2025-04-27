import { useState } from 'react';
import type { IData_SnippetNews } from '../types/types'
import styles from './article.module.scss'
import {
  InfoCircleOutlined,
  PlusSquareOutlined,
  WifiOutlined,
  ContactsOutlined,
  BookOutlined,
  CaretDownFilled,
  DownOutlined,
} from '@ant-design/icons';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

function formateDate(isodate: string): string[] {
  const date = new Date(isodate).toLocaleDateString('en-EN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  const [monthDay, year] = date.split(',')
  const [month, day] = monthDay.split(' ')
  return [day, `${month} ${year}`]
}

function formateReach(reach: number): string {
  const reachString = (reach/1000).toFixed(0)
  return `${reachString}K`
}

function formateTraffic(traffic: number): string {
  return `${(traffic*100).toFixed(0)}%`
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function getHighlights(highlights: string[]): string[] {
  const regex = /<kw>(.*?)<\/kw>/g
  const matches: string[] = []
  let match
  highlights.forEach(elem => {
    while ((match = regex.exec(elem)) !== null) {
      matches.push(match[1]);
    }
  })
  return [...new Set(...[matches])]
}

function formateArticle(article: string, filters: string[]) {
  const pattern = new RegExp(`(${filters.join('|')})`, 'gi')
  const parts = article.split(pattern)
  
  return (
    <span>
      {parts.map((part, i) => {
        const isHighlighted = filters.some(
          word => word.toLowerCase() === part.toLowerCase()
        )
        
        return isHighlighted ? (
          <span key={i} className={styles.spanHighlight}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      })}
    </span>
  );
}

function getHalfArticle(article: string): string {
  const numberOfWords = Math.floor(article.split(' ').length / 2)
  return article.split(' ').slice(0, numberOfWords).join(' ') + ' ...'
}

export default function Article(props: IData_SnippetNews) {

  const [showMore, setShowMore] = useState(false)

  const [articleBody, setArticleBody] = useState(getHalfArticle(props.AB))

  const [sortType, setSortType] = useState<string>('By Relevance')

  const [sortAsc, setSortAsc] = useState(false)

  const [showDuplicates, setShowDuplicates] = useState(false)

  function handleShowMore(){
    setShowMore(prev => !prev)
    if (!showMore){
      setArticleBody(props.AB)
    }
    else{
      setArticleBody(getHalfArticle(props.AB))
    }
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <button onClick={() => setSortType('By Relevance')}>
          By Relevance
        </button>
      ),
      className: styles.menuItemOverride
    },
    {
      key: '2',
      label: (
        <button onClick={() => setSortType('By Date')}>
          By Date
        </button>
      ),
      className: styles.menuItemOverride
    },
    
  ];

  return (
    <article className={styles.article}>
      <div className={styles.articleInfo}>
        <div className={styles.articleInfoLeft}>
          <div>
            <p>{formateDate(props.DP)[0]} <span className={styles.secondartText}>{formateDate(props.DP)[1]}</span></p>
          </div>
          <div>
            <p>{formateReach(props.REACH)} <span className={styles.secondartText}>Reach</span></p>
          </div>
          <div className={styles.traffic}>
            <p className={styles.secondartText}>Top Traffic:</p>
            {props.TRAFFIC.map((elem, i) => {
              return(
                <p key={i}><span className={styles.secondartText}>{elem.value}</span> {formateTraffic(elem.count)}</p>
              )
            })}
          </div>
        </div>
        <div className={styles.articleInfoRight}>
          <p className={styles.sent}>{props.SENT}</p>
          <InfoCircleOutlined />
          <PlusSquareOutlined />
        </div>
      </div>
      <main className={styles.main}>
        <h3 className={styles.header}>{props.TI}</h3>
        <div className={styles.info}>
          <div className={styles.linkDiv}>
            <WifiOutlined />
            <a className={styles.link} href={props.URL} target='_blank'>{props.DOM}</a>
          </div>
          <div className={styles.country}>
            <p>{getFlagEmoji(props.CNTR_CODE)}</p>
            <p className={styles.secondartText}>{props.CNTR}</p>
          </div>
          <div className={styles.lang}>
            <BookOutlined />
            <p className={styles.secondartText}>{props.LANG}</p>
          </div>
          <div className={styles.author}>
            <ContactsOutlined />
            <p className={styles.secondartText}>{props.AU.join(', ')}</p>
          </div>
        </div>
        <p className={styles.articleBody}>{formateArticle(articleBody, getHighlights(props.HIGHLIGHTS))}</p>
        <button onClick={handleShowMore} className={styles.showMore}>Show more<CaretDownFilled className={`${styles.arrow} ${showMore ? styles.open : ''}`}/></button>
      </main>
      <div className={styles.tags}>
        {props.KW.map((elem, i) => {
          return(
            <p key={i} className={styles.tag}><span className={styles.secondartText}>{elem.value}</span>{elem.count}</p>
          )
        })}
        <button className={styles.showAll}>Show All +{9}</button>
      </div>
      <button className={styles.originalSource}><a className={styles.link} href={props.URL} target='_blank'>Original Source</a></button>
      <div className={styles.duplicatesDiv}>
        <div className={styles.info}>
          <p><span className={styles.secondartText}>Duplicates: </span>{192}</p>
          <div className={styles.selectDiv}>
            <Dropdown menu={{items}} className={styles.select}>
                  <span className={styles.secondartText}>{sortType}</span>
            </Dropdown>
            <button className={`${styles.sortDir} ${sortAsc ? styles.asc : ''}`} onClick={() => setSortAsc(prev => !prev)}><DownOutlined /></button>
          </div>
        </div>
        <div className={styles.diplicate}>
          <div className={styles.info}>
            <div className={styles.infoLeft}>
              <p className={styles.secondartText}>{formateDate(props.DP).join(' ')}</p>
              <p>{formateReach(props.REACH)} Top Reach</p>
            </div>
            <div className={styles.infoRight}>
              <InfoCircleOutlined />
              <PlusSquareOutlined />
            </div>
          </div>
          <h3 className={styles.header}>{props.TI}</h3>
          <div className={styles.infoBelow}>
            <div className={styles.linkDiv}>
              <WifiOutlined />
              <a className={styles.link} href={props.URL} target='_blank'>{props.DOM}</a>
            </div>
            <div className={styles.country}>
              <p>{getFlagEmoji(props.CNTR_CODE)}</p>
              <p className={styles.secondartText}>{props.CNTR}</p>
            </div>
            <div className={styles.author}>
              <ContactsOutlined />
              <p className={styles.secondartText}>{props.AU.join(', ')}</p>
            </div>
          </div>
        </div>
        <button className={styles.viewDup} onClick={() => setShowDuplicates(prev => !prev)}><DownOutlined className={`${styles.showDup} ${showDuplicates ? styles.open : ''}`}/>View Duplicates</button>
      </div>

    </article>
  )
}
