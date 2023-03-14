import { GetServerSideProps, NextPage } from "next";
import { type } from "os";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
// getServerSidePropsから渡されるpropsの型
type Props = {
  initialImageUrl: string;
};
// ページコンポーネント関数にpropsを受け取る引数を追加する
const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  //useStateで状態を定義
  const [imageUrl, setImageUrl] = useState(initialImageUrl); //初期値を渡す
  const [loading, setLoading] = useState(false); // 初期値があるためfalse
  //マウント時に画像を読み込む宣言
  // useEffect(() => {
  //   fetchImage().then((newImage) => {
  //     setImageUrl(newImage.url);
  //     setLoading(false);
  //   });
  // }, []);

  //ボタンを押したときに画像を更新する処理
  const handleClick = async () => {
    setLoading(true); //読み込み中フラグを立てる
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  };
  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>
        他の猫さん
      </button>
      <div className={styles.frame}>
        {loading || <img src={imageUrl} className={styles.img} />}
      </div>
    </div>
  );
};
export default IndexPage;

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url,
    },
  };
};

type Image = {
  url: string;
};

const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  //Responseオブジェクトを変数resに格納
  const images = await res.json();
  console.log(images);
  return images[0];
};
