import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import Typography from '@mui/material/Typography';
import electron from 'electron';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import Link from '../components/Link';

const ipcRenderer = electron.ipcRenderer;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
    },
  })
);

export default function BadTweetsPage(): JSX.Element {
  const classes = useStyles({});
  const router = useRouter();

  const [badTweets, setBadTweets] = useState(null);
  const [checked, setChecked] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = ipcRenderer.sendSync('archive/getBadTweets');
        console.log({ result });
        setBadTweets(result);
      } catch (err) {
        console.error(err);
        router.back();
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <>
      <div className={classes.root}>
        <Typography variant="h4">Tweets Manager</Typography>

        <Typography variant="subtitle1" gutterBottom>
          Found tweets:
        </Typography>

        <Link href="/home">Go back</Link>

        <Box sx={{ p: 5, pt: 2 }}>
          {badTweets ? (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {badTweets.map((badTweet, i) => (
                <span key={badTweet.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemButton role={undefined} onClick={handleToggle(badTweet.id)} dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(badTweet.id) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': `checkbox-list-label-${badTweet.id}` }}
                        />
                      </ListItemIcon>

                      <ListItemText
                        primary={format(new Date(badTweet.createdAt), `dd/MM/yyyy 'às' HH:mm:ss`, {
                          locale: ptBR,
                        })}
                        secondary={badTweet.fullText}
                      />
                    </ListItemButton>
                  </ListItem>

                  {i < badTweets.length - 1 && <Divider variant="inset" component="li" />}
                </span>
              ))}
            </List>
          ) : (
            <CircularProgress size={64} disableShrink />
          )}
        </Box>
      </div>
    </>
  );
}
