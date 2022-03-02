import React from 'react';
import {ScrollView} from 'react-native';
import {RichEditor} from 'react-native-pell-rich-editor';

export class RichTextShowerComment extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps={
        showsVerticalScrollIndicator:true
    }

    handleCursorPosition = (scrollY) => {
        this.scrollRef.current.scrollTo({y: scrollY - 30, animated: true});
    }

    render() {
        return (
            <ScrollView ref={(r)=>this.scrollRef=r}>
                <RichEditor
                    disabled
                    initialContentHTML={this.props.text}
                    pasteAsPlainText={true}
                    showsVerticalScrollIndicator={this.props.showsVerticalScrollIndicator}
                    onCursorPosition={this.handleCursorPosition}
                />
            </ScrollView>
        );
    }
}
