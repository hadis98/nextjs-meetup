import { Fragment } from "react";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";
const HomePage = (props) => {
  /**
const [loadedMeetups,setLoadedMeetups] = useState([]);
    useEffect(()=>{
        // send a http request and fetch data
        setLoadedMeetups(DUMMY_MEETUPS);
    },[]);

   */
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of higly active React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

// this function will always run on the server after deployment
// it runs for every incoming requests

/**
export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;

  //   fetch data from API

  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
  };
}
 */

// nextjs will first call getStaticProps before calling HomePage component
// nextjs will wait until this function finishs so it waits until your data is loaded =>> you're able to load data before this component is executed
// big problem: outdated data
// any code we write here will not be available on client side
// becuase this code can only be executed during build process
//can execute any code that run on server
// fetch data from an API
// always should return an object
export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://hadis:0BThiAXozb65FOmo@mycluster.fd9u8.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray(); //find all documents in the collection
  console.log(meetups);
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
    // revalidate: 3600,
  };
}
//10 = number of seconds nextjs will wait until it re-generates this page on the server after deployment for an incoming request (if  a request exists)
// so the re-generated pages will be replaced with old ones
// so you data is never older that 10 seconds

export default HomePage;

// we want to preload a page with data which has a delay
// but we want to render our page with that data
