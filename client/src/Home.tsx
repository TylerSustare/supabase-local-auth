import { gql, useMutation, useQuery } from "@apollo/client";
import { supabase } from "./supabase";

const GET_CLASSROOMS = gql`
  query Classrooms {
    classrooms {
      id
    }
  }
`;

const ADD_CLASSROOM = gql`
  mutation AddClassroomMutation($newClassroomData: NewClassroomInput!) {
    addClassroom(newClassroomData: $newClassroomData) {
      lessons
    }
  }
`;

export const Home = () => {
  const [addClassroom, { data: _data }] = useMutation(ADD_CLASSROOM);

  const addNewItem = () => {};
  const { loading, error, data } = useQuery(GET_CLASSROOMS, {
    pollInterval: 2000,
  });
  if (loading) return <p>Loading ...</p>;
  return (
    <div className="App">
      <h1>Data</h1>
      <button
        onClick={() =>
          addClassroom({
            variables: {
              newClassroomData: {
                lessons: ["a", "b"],
              },
            },
          })
        }
      >
        Add New Item{" "}
      </button>
      <button onClick={async () => await supabase.auth.signOut()}>
        Sign Out
      </button>
      {data.classrooms.map(({ id }) => (
        <h2 key={id}>ID: {id}</h2>
      ))}
    </div>
  );
};
